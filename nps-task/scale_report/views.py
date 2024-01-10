from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response

from .report import ScaleReportObject
from .utils import fetch_scale_response


# Create your views here.


@api_view(["GET" ,])
def scalewise_report(request , scale_id):
    """
    
    The view function that returns statiscal reports about a particular scale

    User provides the scale_id as a path parameter. The same scale_id is used as process id for the normality
    API. 
    """

    try:
        field_add = {"scale_data.scale_id": scale_id}
        scale_response_data = fetch_scale_response(field_add)

        
        scale_report = ScaleReportObject(scale_response_data)

        r = scale_report.report()


        return Response({"is_error" : False , "report" : r } , status = status.HTTP_200_OK)
    
    except Exception as e:
        return Response({"is_error" : True , "report" : str(e) } , status = status.HTTP_400_BAD_REQUEST)
    
