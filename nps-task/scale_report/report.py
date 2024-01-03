import json

from typing import Protocol
from collections import Counter
from concurrent.futures import ThreadPoolExecutor

from EvaluationModule.calculate_function import stattricks_api , generate_random_number , dowellconnection
from EvaluationModule.views import categorize_scale_generate_scale_specific_report



from .exceptions import (
    NoScaleDataFound , 
    NoScaleResponseFound,
    NoScaleType
)

from .utils import (
    get_all_scores,
    likert_label_map,
    get_key_by_value,
    get_percentage_occurrence)


class ScaleReport(Protocol):

    scale_report_type = None

    @classmethod
    def report(all_scores , **kwargs):
        ...


class ScaleReportObject:

    """
        A class that returns a scale report
    """

    allowed_scale_types = ["nps scale" , "stapel scale" , "likert scale"]

    def __init__(self , scale_responses_data : str):


        self.scale_response_data = scale_responses_data
        self._scale_type = None
        self._all_scores = None
        self._scale_id = None

        self._run_validator()


    def report(self):

        for subclass in ScaleReport.__subclasses__():
            if subclass.scale_report_type == self._scale_type:
                return subclass().report(self)
    
        """

        if self.scale_type == "likert scale":

            return LikertScaleReport().report(self.all_scores , scale_data = self.scale_response_data)
        elif self.scale_type == "stapel scale":
            return StapelScaleReport.report(self.all_scores)
        else:
            return NpsScaleReport.report(self.all_scores)

        """

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
        return self._all_scores

    @all_scores.setter
    def all_scores(self , all_scores : list):
        self._all_scores = all_scores


    def _run_validator(self):

        if not self.scale_response_data["data"]:
            raise NoScaleResponseFound("This scale has no response is found")

        scale_data = self.scale_response_data["data"][0].get("scale_data", None)



        if not scale_data:
           raise NoScaleDataFound("The scale has no scale")
        
        self._scale_id = scale_data["scale_id"]
        
        self._check_for_scale_type()

        self._scores_length_validator()

        self._scale_type_validation()

    def _scale_type_validation(self):
        if self.scale_type not in self.allowed_scale_types:
            raise TypeError(f"Can not generate scale report for {self._scale_type}")
        

    def _get_all_scores(self):
        
        self.all_scores = get_all_scores(self.scale_response_data , score_type= "text" if self._scale_type == "likert scale" else "int" )


    def _scores_length_validator(self):
        self._get_all_scores()

        if len(self._all_scores) < 3:
             raise Exception("We need more than three response to be able to create a report")
        

    def _get_scale_response_meta_data(self , metadata):
        pass




    def _check_for_scale_type(self):
        scale_type = None
        for scale in self.scale_response_data["data"]:
            scale_data = scale.get("scale_data", None)

            if not scale_data:
                continue

            scale_type = scale_data.get("scale_type" , None)

            break

        if not scale_type:
            raise NoScaleType("No scale Type found. ")
        
        self._scale_type = scale_type

        
    


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


class NpsScaleReport(ScaleReport):

    scale_report_type = "nps scale"

    @classmethod
    def report(cls , scale_report_object : ScaleReportObject):
        reports = {}
        reports["categorize_scale_report"] = categorize_scale_generate_scale_specific_report("nps scale" , scale_report_object.all_scores)
        reports.update(StatisticsReport.statistics_report(scale_report_object.all_scores))

        return reports
    


class StapelScaleReport(ScaleReport):

    scale_report_type = "stapel scale"

    @classmethod
    def report(cls , scale_report_object : ScaleReportObject):
        reports = {}
        reports["categorize_scale_report"] = categorize_scale_generate_scale_specific_report("stapel scale" , scale_report_object.all_scores)
        reports.update(StatisticsReport.statistics_report(scale_report_object.all_scores))

        return reports

class LikertScaleReport(ScaleReport):

    scale_report_type = "likert scale"

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


    
    @classmethod
    def report(cls , scale_report_object : ScaleReportObject):
        reports ={}

        label_selection = LikertScaleReport._get_label_selection(scale_report_object.scale_id)

        all_scores = LikertScaleReport.convert_all_likert_label(label_selection , scale_report_object.all_scores)

        reports["categorize_scale_report"] = LikertScaleReport.likert_scale_report(label_selection , scale_report_object.all_scores)

        reports.update(StatisticsReport.statistics_report(all_scores))

        return reports