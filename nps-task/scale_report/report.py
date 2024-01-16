import json
import numpy as np

from abc import ABC , abstractmethod
from collections import Counter , defaultdict

from scipy import stats

from EvaluationModule.calculate_function import stattricks_api , generate_random_number , dowellconnection , calculate_stapel_scale_category , calculate_nps_category
from EvaluationModule.views import categorize_scale_generate_scale_specific_report



from .exceptions import (
    NoScaleDataFound , 
    NoScaleResponseFound,
    NoScaleType
)

from .utils import (
    get_all_scores,
    get_positions,
    find_range, 
    median, 
    mode,
    likert_label_map,
    get_key_by_value,
    pearson_correlation,
    independent_t_test,
    get_percentage_occurrence)


class ScaleReportBaseClass(ABC):

    scale_report_type = None
    scales_score_length_threshold = 3

    def __init__(self , scale_response : list) -> None:
        super().__init__()  

        self._scale_response_data = scale_response
        self._validation()

    
    def _validation(self):
        self._all_scores = self._get_all_scores()
        if len(self._all_scores) < self.scales_score_length_threshold:
             raise Exception("We need more than three response to be able to create a report")
    

    @abstractmethod
    def _get_all_scores(self):
        """
            Not implemented
        """

    @abstractmethod
    def report(self , all_scores , **kwargs):

        """
            Not implemented yet
        """


class ScaleReportObject:

    """
        A class that returns a scale report
    """

    allowed_scale_types = None

    def __init__(self , scale_responses_data : str):


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

        if not self.scale_response_data["data"]:
            raise NoScaleResponseFound("This scale has no response is found")

        scale_data = self.scale_response_data["data"][0].get("scale_data", None)


        if scale_data:
           
            self._scale_id = scale_data.get("scale_id")
        else:
            self._scale_id = self.scale_response_data["data"][0].get("scale_id")

        self._check_for_scale_type()

        self._scale_type_validation()


    def _scale_type_validation(self):
        if self._scale_type not in self.allowed_scale_types:
            raise TypeError(f"Can not generate scale report for {self._scale_type}")
        

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

        
        
        statricks_api_response_json = stattricks_api("evaluation_module", generate_random_number() , 16, 3,
                                                {"list1": all_scores})
        
        if isinstance(statricks_api_response_json , dict):
            
            
            poison_case_results = statricks_api_response_json.get("poison case results", {})
            normal_case_results = statricks_api_response_json.get("normal case results", {})
        
            reports["poisson_case_results"] = poison_case_results 
            reports["normal_case_results"]= normal_case_results

        return reports

    @staticmethod
    def statistics_report(all_scores):
        return StatisticsReport._get_statricks_api(all_scores)


class NpsScaleReport(ScaleReportBaseClass):

    scale_report_type = "nps scale"

    def _get_all_scores(self):
        self._all_scores = get_all_scores(self._scale_response_data , score_type= "int" )
        return self._all_scores


    def report(self , scale_report_object : ScaleReportObject):
        reports = {}
        reports["categorize_scale_report"] = categorize_scale_generate_scale_specific_report("nps scale" , self._all_scores)
        reports.update(StatisticsReport.statistics_report(self._all_scores))

        return reports
    


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


    def _get_all_scores(self):
        self._all_scores = get_all_scores(self._scale_response_data , score_type= "text" )
        return self._all_scores

    @staticmethod
    def convert_all_likert_label(label_selection , labels_list):
        return [LikertScaleReport.convert_likert_label(label_selection , label) for label in labels_list]


    @staticmethod
    def convert_likert_label(label_selection , label):
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

        likert_scale = dowellconnection(
                "dowellscale", "bangalore", "dowellscale", "scale", "scale",
                                        "1093", "ABCDE", "fetch", {"_id" : scale_id}, "nil"
            )
        
        if not isinstance(likert_scale , list):

                likert_scale = json.loads(likert_scale)

                label_selection= likert_scale["data"][0]["settings"].get("label_selection") or likert_scale["data"][0]["settings"].get("label_scale_selection")

                return label_selection

        raise Exception("Can't fetch scale settings for likert scale. Try again")


    
    def report(self , scale_report_object : ScaleReportObject):
        reports ={}

        label_selection = LikertScaleReport._get_label_selection(scale_report_object.scale_id)

        all_scores = LikertScaleReport.convert_all_likert_label(label_selection , self._all_scores)

        reports["categorize_scale_report"] = LikertScaleReport.likert_scale_report(label_selection , self._all_scores)

        reports.update(StatisticsReport.statistics_report(all_scores))

        return reports
    

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

            values["x"].append(3)
            values["y"].append(3)

            print(values["x"] , values["y"])

            reports[keys] = [items_report_x , items_report_y ,
                              {"pearson correlation" : stats.pearsonr(values["x"] , values["y"]),
                               "t-test": stats.ttest_ind(values["x"] , values["y"]),
                               "simple-regression" : stats.linregress(values["x"] , values["y"])},
                             ]

            print(reports)


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
        for statements in self._statememt_scores:
            report[statements]["mode"] = mode(self._statememt_scores[statements]["categories"])
            report[statements]["median"] = median(self._statememt_scores[statements]["categories"])
            report[statements]["range"] = find_range(self._statememt_scores[statements]["scores"])
        
            
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

        self._statement_scores.update(self._modes_of_categories)
        return self._statement_scores



    def sum_statements_under_categories(self):
        pass


    def report(self, all_scores, **kwargs):

        return self._gather_scores_()


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
            'summary_statistics': summary_stats,
            'comparison_matrix': dict(comparison_matrix)
        }

        return report



class PercentSumScaleReport(ScaleReportBaseClass):
    scale_report_type = "percent_sum scale"

    def _get_all_scores(self):
        self._all_scores = get_all_scores(self._scale_response_data)
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
            "report": self.calculate_percent_scale_score(self._all_scores)
        }
        return response_



class NpsLiteScaleReport(ScaleReportBaseClass):
    scale_report_type = "npslite scale"
        
    def _get_all_scores(self):
        self._all_scores = get_all_scores(self._scale_response_data , score_type="str")
        return self._all_scores
    
    def categorize_nps_score(self , nps_score):
        if nps_score > 0:
            return "Promoter"
        elif nps_score == 0:
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

        score_length = len(self._all_scores)
        basic_score = self.basic_nps_score(self._all_scores)
        weighted_score = self.weighted_nps_score(self._all_scores)

        response_ = {
            "scale_type": self.scale_report_type,
            "no_of_scales": score_length,
            "npslite_total_score":score_length * 10,
            "score_list": self._all_scores,
            "Basic NPSlite Score": basic_score,
            "Weighted NPSlite Score": weighted_score,
            "Basic NPSlite Category": self.categorize_nps_score(basic_score),
            "Weighted NPSlite Category": self.categorize_nps_score(weighted_score),
        }

        return response_
        

        

        

