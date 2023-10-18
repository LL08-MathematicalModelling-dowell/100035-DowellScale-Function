import json
from nps.dowellconnection import dowellconnection
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import datetime
from nps.eventID import get_event_id









@api_view(['POST', 'GET'])
def response_submit_api_view(request):
    if request.method == 'GET':
        params = request.GET
        id = params.get("scale_id")
        if id:
            # Retrieve specific response by scale_id
            field_add = {"_id": id, "scale_data.scale_type": "thurstone scale"}
            scale = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports",
                                     "scale_reports",
                                     "1094", "ABCDE", "fetch", field_add, "nil")
            data = json.loads(scale)
            if data.get('data') is None:
                return Response({"Error": "Scale Response does not exist."}, status=status.HTTP_400_BAD_REQUEST)
            return Response({"data": data['data']}, status=status.HTTP_200_OK)
        else:
            # Return all thurstone scale responses
            field_add = {"scale_data.scale_type": "thurstone scale"}
            scale = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports",
                                     "scale_reports",
                                     "1094", "ABCDE", "fetch", field_add, "nil")
            settings_list = []
            responses = json.loads(scale)
            for item in responses['data']:
                settings_list.append(item)
            return Response({"data": settings_list}, status=status.HTTP_200_OK)
        

    elif request.method == 'POST':
        response = request.data
        try:
            username = response['username']
        except:
            return Response({"error": "Unauthorized."}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            
            brand_name = response['brand_name']
            
        except KeyError as e:
                return Response({"error": f"Missing required parameter {e}"}, status=status.HTTP_400_BAD_REQUEST)
          
        if "document_responses" in response:
            try:
                document_responses = response['document_responses']
                instance_id = response['instance_id']
                process_id = response['process_id']
                brand_name = response['brand_name']
            except KeyError as e:
                return Response({"error": f"Missing required parameter {e}"}, status=status.HTTP_400_BAD_REQUEST)
            if not isinstance(process_id, str):
                return Response({"error": "The process ID should be a string."}, status=status.HTTP_400_BAD_REQUEST)
            
            for response in document_responses:
                scale_id = response['scale_id']
                statements = response['statements']
                document_data = {"details": {"action": response.get('action', ""),
                                            "authorized": response.get('authorized', ""),
                                            "cluster": response.get('cluster', ""),
                                            "collection": response.get('collection', ""),
                                            "command": response.get('command', ""),
                                            "database": response.get('database', ""),
                                            "document": response.get('document', ""),
                                            "document_flag": response.get('document_flag', ""),
                                            "document_right": response.get('document_right', ""),
                                            "field": response.get('field', ""),
                                            "flag": response.get('flag', ""),
                                            "function_ID": response.get('function_ID', ""),
                                            "metadata_id": response.get('metadata_id', ""),
                                            "process_id": response['process_id'],
                                            "role": response.get('role', ""),
                                            "team_member_ID": response.get('team_member_ID', ""),
                                            "product_name": response.get('product_name', ""),
                                            "update_field": {"content": response.get('content', ""),
                                                            "document_name": response.get('document_name', ""),
                                                            "page": response.get('page', "")},
                                            "user_type": response.get('user_type', ""),
                                            "id": response.get('_id')}
                                }
                
                response_submit_loop(username, scale_id, response, instance_id, process_id, document_data)
        else:
            instance_id = response.get('instance_id')
            try:
                scale_id = response['scale_id']
                username = response['username']
                statements = response['statements']
                brand_name = response['brand_name']
            except KeyError as e:
                return Response({"error": f"Missing required parameter {e}"}, status=status.HTTP_400_BAD_REQUEST)
            
            if "process_id" in response:
                process_id = response.get('process_id')
                if not isinstance(process_id, str):
                    return Response({"error": "The process ID should be a string."}, status=status.HTTP_400_BAD_REQUEST)
                return response_submit_loop(username, scale_id, response, instance_id, process_id)

            result = response_submit_loop(username, scale_id, response, instance_id)
            result = result.data
            return Response(result)
             
        
        

    
    
def response_submit_loop(username, scale_id, response, instance_id, process_id=None, document_data=None):
    
    # Check if response already exists for this event    
    field_add = {"username": username, "scale_data.scale_id": scale_id, "scale_data.scale_type": "thurstone scale",
                "scale_data.instance_id": instance_id}
    previous_response = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports",
                                        "1094", "ABCDE", "fetch",
                                        field_add, "nil")
    previous_response = json.loads(previous_response)
    previous_response = previous_response.get('data')
    if len(previous_response) > 0:
        return Response({"error": "You have already submitted a response for this scale."},
                        status=status.HTTP_400_BAD_REQUEST)

    # Check if scale exists
    event_id = get_event_id()
    field_add = {"_id": scale_id, "settings.scale_category": "thurstone scale"}
    scale = dowellconnection("dowellscale", "bangalore", "dowellscale",
                            "scale", "scale", "1093", "ABCDE", "fetch", field_add, "nil")
    scale = json.loads(scale)
    if not scale.get('data, none'):
        return Response({"Error": "Scale does not exist."}, status=status.HTTP_400_BAD_REQUEST)
    if scale['data'][0]['settings']['scale_category'] != 'thurstone scale':
        return Response({"error": "Invalid scale type."}, status=status.HTTP_400_BAD_REQUEST)
    settings = scale['data'][0]['settings']
    if settings['allow_resp'] == False:
        return Response({"error": "scale not accepting responses"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if all statements are assigned a score
    if len(statements) != len(settings['statements']):
        return Response({"error": "All statements are not assigned a score."}, status=status.HTTP_400_BAD_REQUEST)
    
    # Validate if each scale are assigned a score
    for statement in statements:
        if statement['score'] < settings['min_allowed_score'] or statement['score'] > settings['max_allowed_score'] or type(statement['score']) != int:
            return Response({"error": "Invalid score assigned."}, status=status.HTTP_400_BAD_REQUEST)
    
    # Sort the statements by score
    statements = sorted(statements, key=lambda k: k['score'])
    
    # Calculate median score
    median_score = statements[len(statements)//2]['score']
    
    # Calculate score range
    score_range = settings['max_allowed_score'] - settings['min_allowed_score']
    
    # Calculate standardized score
    standardized_score_list = []
    for statement in statements:
        standardized_score = (statement['score'] - settings['min_allowed_score']) / score_range
        if 0 <= standardized_score <= 1:
            standardized_score_list.append(standardized_score)
        else:
            return Response({"error": "Invalid score assigned."}, status=status.HTTP_400_BAD_REQUEST)
        
    # Calculate cut off score
    cut_off_percentage = settings.get('accuracy_percentage', 0.5)
    cut_off_score = (cut_off_percentage  * score_range) + settings['min_allowed_score']
    
    # Calculate response attitude
    response_attitude = {
        "favourable": 0,
        "unfavourable": 0,
        "neutral": 0
    }
    for statement in standardized_score_list:
        if statement < cut_off_percentage:
            response_attitude['unfavourable'] += 1
        elif statement > cut_off_percentage:
            response_attitude['favourable'] += 1
        else:
            response_attitude['neutral'] += 1
            
    # Calculate attitude percentage
    attitude_percentage = {
        "favourable": (response_attitude['favourable'] / len(statements)) * 100,
        "unfavourable": (response_attitude['unfavourable'] / len(statements)) * 100,
        "neutral": (response_attitude['neutral'] / len(statements)) * 100
    }
    
    # Calculate overall user attitude
    if attitude_percentage['favourable'] == attitude_percentage['unfavourable']:
        overall_user_attitude = "Cannot be decided"
    elif attitude_percentage['favourable'] == attitude_percentage['netural']:
        overall_user_attitude = "Cannot be decided"
    elif attitude_percentage['neutral'] == attitude_percentage['unfavourable']:
        overall_user_attitude = "Cannot be decided"
    else:
        overall_user_attitude = max(attitude_percentage, key=attitude_percentage.get)
        
    # Insert response into database
    field_add = {
        "event_id": event_id,
        "scale_data": {
            "scale_id": scale_id,
            "scale_type": "thurstone scale",
            "instance_id": instance_id
        },
        "brand_data": { 
            "brand_name": response["brand_name"] 
        },
        "statements": statements,
        "median_score": median_score,
        "standardized_score_list": standardized_score_list,
        "cut_off_score": cut_off_score,
        "response_attitude": response_attitude,
        "attitude_percentage": attitude_percentage,
        "overall_user_attitude": overall_user_attitude,
        "date_created": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    if document_data:
        field_add['document_data'] = document_data
    if process_id:
        field_add['process_id'] = process_id
        
    
    x = dowellconnection("dowellscale", "bangalore", "dowellscale", "scale_reports", "scale_reports",
                    "1094", "ABCDE", "insert", field_add, "nil")
    response  = json.loads(x)
    field_add["inserted_id"] = response["inserted_id"]
    return Response({"success": True, "data": field_add }, status=status.HTTP_200_OK)
    
