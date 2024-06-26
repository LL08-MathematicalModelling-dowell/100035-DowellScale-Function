import json
import numpy as np
import pandas as pd

from abc import ABC , abstractmethod
from collections import Counter , defaultdict
from collections.abc import Mapping
from typing import Union, List, Optional


from scipy import stats

from EvaluationModule.calculate_function import stattricks_api , generate_random_number , dowellconnection , calculate_stapel_scale_category , calculate_nps_category
from EvaluationModule.views import categorize_scale_generate_scale_specific_report
from EvaluationModule.normality import Normality_api
from addons.db_operations import datacube_db_response, datacube_db

from paired_comparison.utils import generate_pairs

from .exceptions import (
    ScaleReportError,
    NoScaleDataFound , 
    NoScaleResponseFound,
    NoScaleType,
    ScaleSettingsFetchError
)

from .utils import (
    get_all_scores,
    get_positions,
    find_range, 
    median, 
    mode,
    likert_label_map,
    get_percentile,
    get_key_by_value,
    get_percentage_occurrence,
    chi_square_test,
    t_test)



class ReportSchema(Mapping, object):
    def __init__(self, scale_type , number_of_response , **kwargs):
        data = {"scale_type" : scale_type , "number_of_response" : number_of_response}
        data.update(kwargs)
        self._data = dict(data)

    def update(self , other_dict : dict):
        if not isinstance(other_dict , dict):
            raise Exception("Can't find the other dict")
        self._data.update(other_dict)

    def __getitem__(self, key):
        return self._data[key]

    def __iter__(self):
        return iter(self._data)

    def __len__(self):
        return len(self._data)

    def __repr__(self):
        return repr(self._data)

    def __setitem__(self, key, value):
        self._data[key] = value

    def __delitem__(self, key):
        del self._data[key]


class ScaleReportBaseClass(ABC):
    """
    This is an abstract class for each scale type report. Each scale type report is subclassing this class to create it's report
    The class validates the scores and makes sure each scale type has a report function 

    Attributes:
        class_variable:
            scale_report_type (None , str): value is the scale type e.g scale_report_type = "nps scale"
            scales_score_length_threshold (int) : specifies the minimum number of responses needed to create a response.
        instance variable:
            scale_response (dict): A dictionary that would contain all the scale responses for a scale particular scale id

            
    """


    scale_report_type = None
    df_score_column_name = "scores"
    scales_score_length_threshold = 3

    def __init__(self , scale_response : dict) -> None:
        super().__init__()  

        self._scale_response_data = scale_response
        self._validation()
        self.reports = ReportSchema(self.scale_report_type , self._get_score_length())


    def _get_score_length(self):
        """
        Methods that get the number of score responses for a particular scale
        
        """

        # Checks if the _all_scores is pandas Dataframe
        if isinstance(self._all_scores , pd.DataFrame):
            return self._all_scores[self.df_score_column_name].shape[0]

        # Checks if the _all_scores is a list
        if isinstance(self._all_scores , list):
            return len(self._all_scores)

    
    def _validation(self):
        """
        Method checks if the scale responses pass the length threshold test. 
        """
        self._all_scores = self._get_all_scores()


        if isinstance(self._all_scores , pd.DataFrame):
            if self._all_scores.shape[0] < self.scales_score_length_threshold:
                raise ScaleReportError("We need more than three response to be able to create a report")
        if len(self._all_scores) < self.scales_score_length_threshold:
                raise ScaleReportError("We need more than three response to be able to create a report")
    

    @abstractmethod
    def _get_all_scores(self):
        """
            Method to implemented by the subclass. Here the subclass handles the logic of extracting the scores
            from the scale_response_data
        """

    @abstractmethod
    def report(self , all_scores , **kwargs):

        """
            Method to be implemented by the subclass. Here the subclass handles the logic of report
            from the scale_response data
        """


class ScaleReportObject:

    """
        This is basically like an Interfact class that gets the scale data and delagates it to the appropriate 
        scale type to handle the generation of the report. 

        Attributes:
            scales_responses_data (dict) : 
                Working on the 
    """

    def __init__(self , scale_responses_data : dict):


        self.scale_response_data = scale_responses_data
        self._scale_type = None
        self._scale_id = None
        self.report_type_class : ScaleReportBaseClass

        self._set_allowed_scale_types()
        self._run_validator()



    def report(self):
        return self._report_type_class.report(self)
    

    @property
    def scale_id(self):
        return self._scale_id

    @property
    def scale_type(self):
        return self._scale_type
    

    @scale_type.setter
    def scale_type(self , scale_type):
        self._scale_type = scale_type


    @property
    def all_scores(self):
        return self._report_type_class._all_scores
    
    @classmethod
    def _set_allowed_scale_types(cls):
        cls.allowed_scale_types = []
        for subclass in ScaleReportBaseClass.__subclasses__():
            cls.allowed_scale_types.append(vars(subclass).get("scale_report_type"))


    def _run_validator(self):
        try:
            if not self.scale_response_data["data"]:
                raise NoScaleResponseFound("This scale has no response is found")

            scale_data = self.scale_response_data["data"][0].get("scale_data", None)
            if scale_data:
                self._scale_id = scale_data.get("scale_id")
            else:
                self._scale_id = self.scale_response_data["data"][0].get("scale_id")
            self._check_for_scale_type()
            self._scale_type_validation()
        except:
            if not self.scale_response_data["data"]:
                raise NoScaleResponseFound("This scale has no response is found")

            scale_data = self.scale_response_data["data"][0]
            if scale_data:
                self._scale_id = scale_data.get("scale_id")
            else:
                self._scale_id = self.scale_response_data["data"][0].get("scale_id")
            self._check_for_scale_type()
            self._scale_type_validation()

    def _scale_type_validation(self):
        if self._scale_type not in self.allowed_scale_types:
            raise ScaleReportError(f"Can not generate scale report for {self._scale_type}")
        

    def _get_all_scores(self):

        self._all_scores = self._report_type_class()

        if self._scale_type != "perpetual scale mapping":
        
            self._all_scores = get_all_scores(self.scale_response_data , score_type= "text" if self._scale_type == "likert scale" else "int" )
        elif self._scale_type == "thurstone scale" or "thurstone" in self._scale_type:
            self._all_scores == get_all_scores(self.scale_response_data)
        
        else:
            self._all_scores = self._get_scale_response_meta_data("positions")


        

    def _get_scale_response_meta_data(self , metadata):
        return [x[metadata] for x in self.scale_response_data]
    
    def _get_report_type_class(self):
        for subclass in ScaleReportBaseClass.__subclasses__():
            if subclass.scale_report_type == self._scale_type:
                self._report_type_class = subclass(self.scale_response_data)



    def _check_for_scale_type(self):
        scale_type = None
        for scale in self.scale_response_data["data"]:
            scale_data = scale.get("scale_data", None)

            if not scale_data:
                scale_type = scale.get("scale_type" , None)

                if not scale_type:
                    continue

                else:
                    break

            scale_type = scale_data.get("scale_type" , None)

            break

        if not scale_type:
            raise NoScaleType("No scale Type found. ")
        
        self._scale_type = scale_type
        self._get_report_type_class()


class StatisticsReport:

    @staticmethod
    def _get_statricks_api(all_scores):
        reports = {}
        random_number = generate_random_number()
        statricks_api_response_json = stattricks_api("evaluation_module", random_number  , 16, 3,
                                                {"list1": all_scores})
        
        if isinstance(statricks_api_response_json , dict):
            
            
            poison_case_results = statricks_api_response_json.get("poison case results", {})
            normal_case_results = statricks_api_response_json.get("normal case results", {})

            reports["normality_check"] =  Normality_api(random_number)
        
            reports["poisson_case_results"] = poison_case_results 
            reports["normal_case_results"]= normal_case_results

        
            
        

        return reports

    @staticmethod
    def statistics_report(all_scores):
        return StatisticsReport._get_statricks_api(all_scores)


class NpsScaleReport(ScaleReportBaseClass):

    scale_report_type = "nps scale"

    def _get_all_scores(self):
        try:
            self._all_scores = pd.DataFrame(self._scale_response_data["data"])
            self._all_scores["scores"] = self._all_scores["score"].apply(lambda df_ : df_.get("score"))
            # self._all_scores["date_created"] = pd.to_datetime(self._all_scores['date_created'])

            return self._all_scores
        except:
            self._all_scores = pd.DataFrame(self._scale_response_data["data"])
            self._all_scores["scores"] = self._all_scores["score"]
            return self._all_scores


    def create_group(self , field):
        return self._all_scores.pivot_table(index = self._all_scores.index , columns=field , values="scores")


    def category_group_contigency_table(self , field : str):
        df_ = (self._all_scores.groupby([field, "category"]).apply(lambda df: df["scores"].count())
                            .reset_index(name='count')
                            .pivot_table(index = field , columns = "category" , values = "count"))
        return df_
    
    def set_chi_square_result(self , dataframe: pd.DataFrame ,  field : str):
         if self._all_scores[field].nunique() > 1:
            
            self.reports.update({f"{field} chi-square" : chi_square_test(dataframe)})


    def time_groups(self , dataframe : pd.DataFrame , column_name_with_date_values: str):
        df_ = (dataframe.groupby([pd.Grouper(key=column_name_with_date_values , freq=pd.Timedelta(hours=3)) ,"category"]).apply(lambda df: df["scores"].count())
                .reset_index(name="count")
                .pivot_table(index = "date_created" , columns = "category" , values = "count")
                .fillna(0))

        return df_
    
    def p_value_test(self , dataframe : pd.DataFrame):
        pairs = generate_pairs(dataframe.columns)
        for pair in pairs:
            self.reports.update({f"{pair[0]-pair[1]} t-test" : t_test(dataframe[pair[0]] , dataframe[pair[1]])})
            


    def report(self , scale_report_object : ScaleReportObject):
        try:
            self.reports = {}
            self.reports["categorize_scale_report"] = categorize_scale_generate_scale_specific_report("nps scale" , self._all_scores["scores"].to_list())
            self.reports["percentiles"] = get_percentile(np.array(self._all_scores["scores"]))
            self.reports.update(StatisticsReport.statistics_report(self._all_scores["scores"].to_list()))
            self.reports["one_sample_t_test"] = stats.ttest_1samp(self._all_scores["scores"].to_list() , 5)
        except Exception as e:
            print(e)
        """
        if "poisson_case_results" in self.reports:
            self.reports["covariance value"] =  (self.reports["poisson_case_results"]["standardDeviation"]["list1"] / self.reports["poisson_case_results"]["mean"]["list1"]) * 100

        
        self.set_chi_square_result(self.category_group_contigency_table("product_name") ,"product_name")
        self.set_chi_square_result(self.category_group_contigency_table("brand_name") , "brand_name")
        self.set_chi_square_result(self.time_groups(self._all_scores , "date_created") , "date_created")

        product_name_group = self.create_group("product_name")

        if len(product_name_group.columns) > 1 :
            self.reports.update(product_name_group.corr().to_dict(orient="records"))

            self.p_value_test(product_name_group)

        
        """

        return self.reports
    


class StapelScaleReport(ScaleReportBaseClass):

    scale_report_type = "stapel scale"

    def _get_all_scores(self):
        self._all_scores = get_all_scores(self._scale_response_data , score_type= "int" )
        return self._all_scores

    def report(self , scale_report_object : ScaleReportObject):
        reports = {}
        reports["categorize_scale_report"] = categorize_scale_generate_scale_specific_report("stapel scale" , self._all_scores)
        reports.update(StatisticsReport.statistics_report(self._all_scores))

        return reports

class LikertScaleReport(ScaleReportBaseClass):

    scale_report_type = "likert scale"
    df_score_column_name = "category"
    def _get_all_scores(self):
        try:
            self._all_scores = pd.DataFrame(self._scale_response_data["data"])
            self._all_scores["brand_name"] = self._all_scores["brand_data"].apply(lambda df_ : df_.get("brand_name"))
            self._all_scores["category"] = self._all_scores["score"].apply(lambda df_ : df_.get("score"))
            self._all_scores["date_created"] = pd.to_datetime(self._all_scores['date_created'])
            return self._all_scores
        except:
            self._all_scores = pd.DataFrame(self._scale_response_data["data"])
            self._all_scores["category"] = self._all_scores["score"]
            return self._all_scores

    @staticmethod
    def convert_all_likert_label(label_selection , labels_list):
        return [LikertScaleReport.convert_likert_label(label_selection , label) + 1 for label in labels_list]

    @staticmethod
    def convert_likert_label(label , label_selection):
        return get_key_by_value(likert_label_map[label_selection] , label)
    

    @staticmethod
    def likert_scale_report(label_selection , all_scores):
        counts = Counter(all_scores)

        percentage_dict = get_percentage_occurrence(counts)


        return {
            "max_reponse" : get_key_by_value(counts , max(list(counts.values()))),
            "no_of_scores" : len(all_scores),
            "no_of_unique_scores" : len(counts),
            "score_list" : all_scores,
            "score_label_mappings": likert_label_map[label_selection],
            "scale_data" : percentage_dict,
            }
    
    @staticmethod
    def _get_label_selection(scale_id):
        try:
            likert_scale = dowellconnection(
                    "dowellscale", "bangalore", "dowellscale", "scale", "scale",
                                            "1093", "ABCDE", "fetch", {"_id" : scale_id}, "nil"
                )

            if not isinstance(likert_scale , list):

                    likert_scale = json.loads(likert_scale)

                    label_selection= likert_scale["data"][0]["settings"].get("label_selection") or likert_scale["data"][0]["settings"].get("label_scale_selection")

                    return label_selection

        except:
            likert_scale = datacube_db(api_key="3db9086b-527f-408b-9fea-ff552160bf40", operation="fetch", id=scale_id)
            if not isinstance(likert_scale, list):
                label_selection = likert_scale["data"][0]['settings'].get("pointers")
                return label_selection
            raise ScaleSettingsFetchError("Can't fetch scale settings for likert scale. Try again")
    
    def check_groups(function):
        import functools
        functools.wraps(function)
        def decorators(df , groups: Union[None , List[str]] = None):
            if groups:
                lists = [df[columns]  for columns in groups]
            else:
                lists = [df[columns] for columns in df.columns]

            if len(lists) < 2:
                return None
            
            return function(df , lists)
        return decorators
    


    @check_groups
    def independent_t_test(self , df ,  groups):
        if len(groups) != 2:
            return None
        return stats.ttest_ind(*groups)

    @check_groups
    def paired_t_test(self , df ,  groups):
        if len(groups) != 2:
            return None
        return stats.ttest_rel(*groups)

    @check_groups
    def wilcoxon_test(self , df ,  groups):
        if len(groups) != 2:
            return None
        return stats.wilcoxon(*groups)
    

    def one_sample_t_test(self , label_scale_selection , scores):
        """One sample t_test function that would return a p_value between the scores and neutral point. 

        Currently, this implementation works for the label_selection that are odd number categories. 
        
        """
        if label_scale_selection % 2 != 0:
            t_statistic , p_value =  stats.ttest_1samp(scores , round(label_scale_selection / 2) - 1)
            return {"t_statistic" : t_statistic ,  "p_value" : p_value}
        return None
    
    def correllation_analysis(self , groups : Union[None , List[str]] = None):
        """
        Correllation matrix for the dataframe. 
        It's typically generate  a correllation between the scores and any other variable such as 'age'.
        """
        try: 
            if not groups:
                groups = self._all_scores.columns

            return self._all_scores[groups].corr()

        except Exception as e:
            return str(e)




    def anova_analysis(self , df : pd.DataFrame ,  groups: Union[None , List[str]] = None):
        """
        Anova analysis between specific columns of the dataframe. Only will do analysis between two or more groups. 



        arguments:
            df: pandas dataframe that anova analysis will be run on
            groups: kwarg that specifies the specific groups that test would be conducted between.
                    Default is none which means all the groups in the stuff there.
 
        
        """
        if groups:
            lists = [df[columns]  for columns in groups]
        else:
            lists = [df[columns] for columns in df.columns]

        if len(lists) < 2:
            return None

        f_statistics_ , p_value = stats.f_oneway(*lists)
        return {f"Anova_test {' '.join(lists)}" : {"f_statistics" : f_statistics_ , "p_value" : p_value} }

    def group_by_(self, column):
        return self._all_scores.pivot_table(index = self._all_scores.index , values = "scores" , columns=column)

    
    def report(self , scale_report_object : ScaleReportObject):
        label_selection = LikertScaleReport._get_label_selection(scale_report_object.scale_id)
        try:
            self._all_scores["scores"] = self._all_scores["category"].apply(LikertScaleReport.convert_likert_label , args=(label_selection, ))
        except Exception as e:
            print("Tombotltasasas", e)
        print(self._all_scores)
        scores = self._all_scores["scores"].to_list()
        categories = self._all_scores["category"].to_list()

        print(self.group_by_("brand_name"))

        self.reports["categorize_scale_report"] = LikertScaleReport.likert_scale_report(label_selection , categories)

        self.reports["statisitcs"] = StatisticsReport.statistics_report(scores)
        self.reports["one_sample_test"] = self.one_sample_t_test(label_selection , scores)

        #self.reports["corr_matrix"] = pd.DataFr

        return self.reports
    

class PerpetualMappingScaleReport(ScaleReportBaseClass):

    scale_report_type = "perceptual_mapping scale"
    scales_score_length_threshold = 0

    def _get_all_scores(self):
        self._all_scores = get_positions(self._scale_response_data)

        return self._all_scores


    def report(self , scale_report_object : ScaleReportObject):
        reports = {}

        item_list_dicts = defaultdict(lambda: defaultdict(list))

        for score in  self._all_scores:
            for key in score.keys():
                item_list_dicts[key]["x"].append(score[key][0])
                item_list_dicts[key]["y"].append(score[key][1])

        for keys , values in item_list_dicts.items():
            items_report_x = calculate_stapel_scale_category(values["x"])
            items_report_y = calculate_stapel_scale_category(values["y"])

            items_report_x["mode"] , items_report_y["mode"] =  mode(values["x"]) , mode(values["y"])
            items_report_x["median"] , items_report_y["median"] = mode(values["x"]) , mode(values["y"])
            items_report_x["range"] , items_report_y["range"] = find_range(values["x"]) , find_range(values["y"])
            items_report_x["std"] , items_report_y["std"] = np.array(values["x"]).std() , np.array(values["y"]).std()
            items_report_x["percentile"] , items_report_y["percentile"] = get_percentile(values["x"]) , get_percentile(values["y"])


            correlation_coe , correllation_p_value = stats.pearsonr(values["x"] , values["y"])

            t_test_p_value , t_statistic = stats.ttest_ind(values["x"] , values["y"])

            slope , intercept , r_value , linear_reg_p_value , std_err = stats.linregress(values["x"] , values["y"])

            reports[keys] = {"x" : items_report_x  ,  "y" : items_report_y ,
                              "t_test" : {"p_value" : t_test_p_value , "t_statistic" : t_statistic},
                               "pearson_correllation": {"coefficient" : correlation_coe , 
                                                        "p_value" : correllation_p_value },
                               "simple-regression" : {
                                        "slope" : slope , 
                                        "intercept" : intercept,
                                        "r-value" : r_value , 
                                        "p_value" : linear_reg_p_value,
                                        "std_err" : std_err
                               }}

        return reports
    

class ThurststoneScaleReport(ScaleReportBaseClass):

    scale_report_type = "thurstone scale"

    def _get_scale_settings(self):
        scale_id = self._scale_response_data["data"][0]["scale_data"]["scale_id"]
        self.scale_settings = json.loads(dowellconnection(
                "dowellscale", "bangalore", "dowellscale", "scale", "scale",
                                        "1093", "ABCDE", "fetch", {"_id" : scale_id}, "nil"
            ))
    
    def _get_all_scores(self):
        self._all_scores = []
        for score in self._scale_response_data["data"]:
            self._all_scores.append(score["statements"] )
        return self._all_scores
    
    def _normalize_the_scores(self):
        pass

    def _categorize_scores(self , statement):
        if statement < 0.5:
            return 'unfavourable'
        elif statement > 0.5:
            return 'favourable'
        else:
            return 'neutral'
    
    def _find_score_category(self , statement):
        score_range = self.scale_settings["data"][0]["settings"]["max_allowed_score"] - self.scale_settings["data"][0]["settings"]["min_allowed_score"]
        standardized_score = (statement - self.scale_settings["data"][0]["settings"]["min_allowed_score"]) / score_range
        return self._categorize_scores(standardized_score)
           
    
    def __gather_statement_scores(self):
        self._statememt_scores = defaultdict(lambda : {"categories" : [] , "scores" : [] })

        for statements in self._all_scores:
            if isinstance(statements , list):
                for statements_dict in statements:
                    keys = tuple(statements_dict.keys())
                    
                    self._statememt_scores[statements_dict[keys[0]]]["categories"].append(self._find_score_category
                                                                            (statements_dict.get(keys[1]))
                            )
                    self._statememt_scores[statements_dict[keys[0]]]["scores"].append(
                                                                    statements_dict.get(keys[1])
                            )
        

    def report(self , scale_report_object : ScaleReportObject):
        self._get_scale_settings()
        self.__gather_statement_scores()
        report = defaultdict(dict)
        report_counts = {}

        for statements in self._statememt_scores:
            report[statements]["mode"] = mode(self._statememt_scores[statements]["categories"])
            report[statements]["median"] = median(self._statememt_scores[statements]["categories"])
            report[statements]["range"] = find_range(self._statememt_scores[statements]["scores"])
            report[statements]["mean"] = np.mean(self._statememt_scores[statements]["scores"])
            report[statements]["std"] = np.std(self._statememt_scores[statements]["scores"])
            report[statements]["count"] = Counter(self._statememt_scores[statements]["categories"])

            report_counts[statements] = Counter(self._statememt_scores[statements]["categories"])


        dataframe = pd.DataFrame.from_dict(report_counts , orient = "index").T
        dataframe = dataframe.fillna(0)

        report["correllation_matrix"]= dataframe.corr().to_dict(orient="index")

        report["chi_square values"] = chi_square_test(dataframe)
            
        return report


class QSortScaleReport(ScaleReportBaseClass):

    scale_report_type = "Qsort"

    scales_score_length_threshold = 0
    
    def _get_all_scores(self):
        self._all_scores = []
        for score in self._scale_response_data["data"]:
            self._all_scores.append(score["results"])
        return self._all_scores

    def _populate_dictionary(self , dictionary , in_place_dict , values):
        for dicts in dictionary:
            if "statement" in dicts and "score" in dicts:
                in_place_dict[dicts["statement"]]["categories"].append(values)
                in_place_dict[dicts["statement"]]["scores"].append(dicts["score"])

    
    def _gather_scores_(self):
        self._statement_scores = defaultdict(lambda : {"categories" : [] , "scores" : [] })

        self._modes_of_categories = {"Disagree" : 0 , "Agree" : 0 , "Neutral" : 0}

        for statement in self._all_scores:
            self._populate_dictionary(statement["Disagree"] , self._statement_scores , "Disagree")
            self._populate_dictionary(statement["Agree"] , self._statement_scores , "Agree")
            self._populate_dictionary(statement["Neutral"] , self._statement_scores , "Neutral")

            self._modes_of_categories["Disagree"] += len(statement["Disagree"])
            self._modes_of_categories["Agree"] += len(statement["Agree"])
            self._modes_of_categories["Neutral"] += len(statement["Neutral"])

        return self._statement_scores



    def sum_statements_under_categories(self):
        pass


    def report(self, all_scores, **kwargs):

        self.reports["reports by statments"] = self._gather_scores_()

        self.reports["frequency table"] = self._modes_of_categories

        return self.reports


class RankingScaleReport(ScaleReportBaseClass):

    scale_report_type = "ranking scale"
    scales_score_length_threshold = 0


    def _get_all_scores(self):
        self._all_scores = []
        for score in self._scale_response_data["data"]:
            self._all_scores.append(score["rankings"])
        return self._all_scores

    def report(self, all_scores, **kwargs):
            
        rank_distribution = defaultdict(lambda: defaultdict(int))
        total_ranks = defaultdict(int)
        count_ranks = defaultdict(int)
        comparison_matrix = defaultdict(lambda: defaultdict(int))

        for rankings in self._all_scores:
            # Process each ranking submission
            for stage_ranking in rankings:
                print(stage_ranking, "stage_ranking")
                for rank_info in stage_ranking['stage_rankings']:
                    item_name = rank_info['name']
                    rank = rank_info['rank']

                    # Update rank distribution and totals
                    rank_distribution[item_name][rank] += 1
                    total_ranks[item_name] += rank
                    count_ranks[item_name] += 1

                    # Update comparison matrix
                    for other_item in rank_distribution:
                        if other_item != item_name:
                            if rank_distribution[other_item][rank] > 0:
                                comparison_matrix[item_name][other_item] += 1

            # Calculate summary statistics
        summary_stats = {}
        for item, ranks in total_ranks.items():
                avg_rank = ranks / count_ranks[item]
                rank_list = [rank for rank, count in rank_distribution[item].items() for _ in range(count)]
                std_dev = np.std(rank_list)
                summary_stats[item] = {
                    'average_rank': avg_rank,
                    'std_dev': std_dev,
                    'rank_distribution': dict(rank_distribution[item])
                }

            # Compile the report
        report = {
            "scale_type" : self.scale_report_type,
             "no_of_responses" : len(self._all_scores),
            'summary_statistics': summary_stats,
            'comparison_matrix': dict(comparison_matrix)
        }

        return report



class PercentSumScaleReport(ScaleReportBaseClass):
    scale_report_type = "percent_sum scale"

    def _get_all_scores(self):
        self._all_scores = get_all_scores(self._scale_response_data , score_type = "str")
        return self._all_scores

    def score_average(self):

        if not self._all_scores or not self._all_scores[0]:
            return []

        num_categories = len(self._all_scores[0])
        aggregate = [0] * num_categories  # Initialize aggregate list for each score category

        for instance in self._all_scores:
            for i, score in enumerate(instance):
                aggregate[i] += score

        # Calculate the average for each category
        num_instances = len(self._all_scores)
        average_scores = [total / num_instances for total in aggregate]

        return average_scores

        """
        max_score = max(max(instance) for instance in self._all_scores)

        # Calculate average score for each category
        num_categories = len(self._all_scores[0])
        category_averages = [0] * num_categories
        for instance in self._all_scores:
            for i, score_ in enumerate(instance):
                category_averages[i] += score_
        category_averages = [total / len(score) for total in category_averages]

        # Calculate total score for each instance
        total_scores_per_instance = [sum(instance) for instance in self._all_scores]

        # Calculate average score across all instances
        average_score = sum(total_scores_per_instance) / len(self._all_scores)

        """

    def report(self, all_scores, **kwargs):
        # Check if instances list is empty or malformed
        response_ = {
            "scale_type": self.scale_report_type,
            "no_of_scales": len(self._all_scores),
            "average_score": self.score_average(),
            "max_total_score": max(self._all_scores),
        }
       
        return response_


class PercentScaleReport(ScaleReportBaseClass):
    scale_report_type = "percent scale"

    scales_score_length_threshold = 0

    def _get_all_scores(self):
        
        self._all_scores = []
        for score in self._scale_response_data["data"]:
            value = score.get("score")
            if not value:
                continue
            self._all_scores.extend(value)
        return self._all_scores

    def calculate_percent_scale_score(self , aggregate_scores, max_score=100):
    # Assuming max_score is the maximum possible score for each product
        total_possible_score = max_score * len(aggregate_scores)
        percent_scores = [(score / total_possible_score) * 100 for score in aggregate_scores]
        return percent_scores

    def report(self, all_scores, **kwargs):

    
        response_ = {
            "scale_type": self.scale_report_type,
            "no_of_scales": len(self._all_scores),
            "aggregated_score_list": self._all_scores,
            #"percent_total_score": len(self._all_scores) * 10,
            "report": self.calculate_percent_scale_score(self._all_scores),
            "percentile" : get_percentile(np.array(self._all_scores)),
            "statistics" : StatisticsReport.statistics_report(self._all_scores)
        }
        return response_



class NpsLiteScaleReport(NpsScaleReport , ScaleReportBaseClass):
    scale_report_type = "npslite scale"


    def _get_all_scores(self):
        self._all_scores = super()._get_all_scores()
        self._all_scores["category"] = self._all_scores["scores"].apply(self.categorize_nps_score)

        return self._all_scores
    
    def categorize_nps_score(self , nps_score):
        if nps_score == 3:
            return "Promoter"
        elif nps_score == 2:
            return "Passive"
        else:
            return "Detractor"

    def basic_nps_score(self , responses):
        promoters = responses.count(3)
        detractors = responses.count(1)
        total_responses = len(responses)

        if total_responses == 0:
            return 0  # Avoid division by zero if there are no responses

        nps_score = (promoters - detractors) / total_responses * 100
        return nps_score
    
    def weighted_nps_score(self , responses, w1=0.7, w2=0.3):
        # Assigning weights based on the score
        weighted_scores = [(w1 if r == 3 else w2 if r == 1 else 0.5) for r in responses]
        promoters_weighted = sum(w for r, w in zip(responses, weighted_scores) if r == 3)
        detractors_weighted = sum(w for r, w in zip(responses, weighted_scores) if r == 1)
        total_weighted = sum(weighted_scores)
        nps_score = (promoters_weighted - detractors_weighted) / total_weighted * 100
        return nps_score
    
    def report(self, all_scores, **kwargs):

        score_length = self._all_scores.shape[0]
        basic_score = self.basic_nps_score(self._all_scores["scores"].to_list())
        weighted_score = self.weighted_nps_score(self._all_scores["scores"].to_list())

        self.reports = {
            "scale_type": self.scale_report_type,
            "no_of_scales": score_length,
            "npslite_total_score":score_length * 10,
            "Basic NPSlite Score": basic_score,
            "Weighted NPSlite Score": weighted_score,
            "Basic NPSlite Category": self.categorize_nps_score(basic_score),
            "Weighted NPSlite Category": self.categorize_nps_score(weighted_score),
            "percentile" : get_percentile(self._all_scores["scores"].to_list()),
            "frequency_table" : self._all_scores["category"].value_counts().to_dict(),
            
        }

        self.reports.update(StatisticsReport._get_statricks_api(self._all_scores["scores"].to_list()))

        """

        
        self.set_chi_square_result(self.category_group_contigency_table("product_name") ,"product_name")
        self.set_chi_square_result(self.category_group_contigency_table("brand_name") , "brand_name")
        self.set_chi_square_result(self.time_groups(self._all_scores , "date_created") , "date_created")

        self.reports["one_sample_t_test"] = stats.ttest_1samp(self._all_scores["scores"].to_list() , 5)

        product_name_group = self.create_group("product_name")

        if len(product_name_group.columns) > 1 :
            self.reports.update(product_name_group.corr().to_dict(orient="records"))

            self.p_value_test(product_name_group)

        """

        return self.reports

class PairedComparisonScaleReport(ScaleReportBaseClass):
    scale_report_type = "paired-comparison scale"

    def _get_all_scores(self):
        self._all_scores = []
        for score in self._scale_response_data["data"]:
            value = score.get("ranking")
            if not value:
                continue
            self._all_scores.append(value)
        return self._all_scores
    
    def _scale_settings(self , scale_id):

        paired_scale = dowellconnection(
                "dowellscale", "bangalore", "dowellscale", "scale", "scale",
                                        "1093", "ABCDE", "fetch", {"_id" : scale_id}, "nil"
            )
        
        paired_scale = json.loads(paired_scale)

        
        if isinstance(paired_scale , str) or isinstance(paired_scale , dict):

                self._item_list = paired_scale["data"][0]["settings"].get("item_list")
                self._total_pairs = paired_scale["data"][0]["settings"].get("total_pairs")

        else:
            raise ScaleReportError("Can't fetch scale settings for likert scale. Try again")
    
    def _get_scale_id(self):
        data = self._scale_response_data["data"][0]

        scale_data = data.get("scale_data")

        if not scale_data:
            scale_id =  data.get("scale_id")
            if not scale_id:
                raise ScaleReportError("No Scale Id found. Inconsistent response schema")
            return scale_id
        
        scale_id = scale_data.get("scale_id")
        if not scale_id:
            raise ScaleReportError("No Scale Id found. Inconsistent response schema")
        return scale_id

    
    def report(self, all_scores, **kwargs):
        scale_id = self._get_scale_id()
        self._scale_settings(scale_id)

        report_con = {"scale_type" : self.scale_report_type,
                        "no_of_responses" : len(self._all_scores)}

        frequency_distribution = {num : defaultdict(int) for num in range(1 , self._total_pairs + 1)}

        for scores in self._all_scores:
            for pair , score in zip(frequency_distribution.keys() , scores[:self._total_pairs]):
                if score not in self._item_list:
                    try:
                        score = scores[self._total_pairs : self._total_pairs + 1][0]
                    except:
                        continue
                frequency_distribution[pair][score] += 1
    

        report_con.update(frequency_distribution)

        if len(frequency_distribution) > 1:

            dataframe = pd.DataFrame.from_dict(frequency_distribution , orient='index')

            report_con["chi_square values"] = chi_square_test(dataframe)

            from statsmodels.stats.contingency_tables import mcnemar

            report_con["mcneamr_test"] = mcnemar(dataframe)

            """
            pairs = list(permutations(frequency_distribution.keys() , 2))

            pairs_statistic = {p : {} for p in pairs}

            from statsmodels.stats.contingency_tables import mcnemar

            for pair in pairs:
                pairs_statistic[pair]["mcnemar test"] = mcnemar(frequency_distribution[pair[0]] , 
                                                frequency_distribution[pair[1]])
                

            report_con.update(pairs_statistic)

            """

        return report_con


    

        

