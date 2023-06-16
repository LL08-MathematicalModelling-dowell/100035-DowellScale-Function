<<<<<<< HEAD
## Dowell Scales API Documentation

       
1.      Scale Settings
        1. Upload Scale Settings
                - URL: (POST) https://100035.pythonanywhere.com/api/nps_settings_create/
                - Body: {
                        "user": true,
                        "username": "Ndoneambrose",
                        "orientation": "horizontal",
                        "scalecolor": "#8f1e1e",
                        "roundcolor": "#938585",
                        "fontcolor": "#000000",
                        "fomat": "numbers",
                        "no_of_scales": 2,
                        "time": "60",
                        "name": "scalename",
                        "left": "good",
                        "right": "best",
                        "center": "neutral",
                         }   
                - Response: {
                                "success": "{\"isSuccess\": true, \"inserted_id\": \"647dac66eb4e515f77a2165f\"}",
                                "data": {
                                    "event_id": "05:06:2023,09:35:34",
                                    "settings": {
                                        "orientation": "horizontal",
                                        "scalecolor": "#8f1e1e",
                                        "numberrating": 10,
                                        "no_of_scales": 1,
                                        "roundcolor": "#938585",
                                        "fontcolor": "#000000",
                                        "fomat": "numbers",
                                        "time": "60",
                                        "template_name": "scalename9769",
                                        "name": "scalename",
                                        "text": "good+neutral+best",
                                        "left": "good",
                                        "right": "best",
                                        "center": "neutral",
                                        "allow_resp": false,
                                        "scale-category": "nps scale",
                                        "show_total_score": "true",
                                        "date_created": "2023-06-05 09:35:34"
                                    }
                                },
                                "scale_urls": "https://100035.pythonanywhere.com/nps-scale1/scalename9769?brand_name=WorkflowAI&product_name=editor"
                            }
                -----------------------------------------------------------------------------------------------------------------
         2. Update Scale Settings
                - URL: (PUT) https://100035.pythonanywhere.com/api/nps_settings_create/
                - Body: {
                        "scale_id": "63e8b4c87f4aa8f650162b7a",
                        "orientation": "vertical",
                        "roundcolor": "#ffffff",                   
                        "name": "scalename1",                
                         }
                 - Response: {
                                "success": "{\"isSuccess\": true, \"inserted_id\": \"63e8b4c87f4aa8f650162b7a\"}",
                                "data": {
                                    "event_id": "05:06:2023,09:35:34",
                                    "settings": {
                                        "orientation": "vertical",
                                        "scalecolor": "#8f1e1e",
                                        "numberrating": 10,
                                        "no_of_scales": 1,
                                        "roundcolor": "#ffffff",
                                        "fontcolor": "#000000",
                                        "fomat": "numbers",
                                        "time": "60",
                                        "template_name": "scalename9769",
                                        "name": "scalename1",
                                        "text": "good+neutral+best",
                                        "left": "good",
                                        "right": "best",
                                        "center": "neutral",
                                        "allow_resp": false,
                                        "scale-category": "nps scale",
                                        "show_total_score": "true",
                                        "date_created": "2023-06-05 09:35:34"
                                    }
                                },
                                "scale_urls": "https://100035.pythonanywhere.com/nps-scale1/scalename9769?brand_name=WorkflowAI&product_name=editor"
                            }
                   -----------------------------------------------------------------------------------------------------------------
          3. Get Scale Settings
                    - URL (GET) https://100035.pythonanywhere.com/api/nps_settings_create/
                    - Body:   {"scale_id": "63e8b4c87f4aa8f650162b7a"}
                    - Response: {
                                    "data": {
                                        "isSuccess": true,
                                        "data": {
                                            "_id": "63e8b4c87f4aa8f650162b7a",
                                            "event_id": "FB1010000000167619501056435773",
                                            "settings": {
                                                "orientation": "horizontal",
                                                "scalecolor": "green",
                                                "numberrating": 10,
                                                "no_of_scales": 3,
                                                "roundcolor": "yellow",
                                                "fontcolor": "blue",
                                                "fomat": "numbers",
                                                "time": 0,
                                                "template_name": "testing5350",
                                                "name": "scale_label",
                                                "text": "good+neutral+best",
                                                "left": "good",
                                                "right": "best",
                                                "center": "neutral",
                                                "scale-category": "nps scale",
                                                "show_total_score": "true",
                                                "date_updated": "2023-06-03 12:21:46"
                                            }
                                        }
                                    },
                                    "urls": [
                                        "https://100035.pythonanywhere.com/nps-scale1/testing5350?brand_name=WorkflowAI&product_name=editor/1",
                                        "https://100035.pythonanywhere.com/nps-scale1/testing5350?brand_name=WorkflowAI&product_name=editor/2",
                                        "https://100035.pythonanywhere.com/nps-scale1/testing5350?brand_name=WorkflowAI&product_name=editor/3"
                                    ]
                 -----------------------------------------------------------------------------------------------------------------------------------                
           4. Get All Scale Settings
                     - URL: (GET) https://100035.pythonanywhere.com/api/nps_settings
                     - Body: None    
                     - Response: {
                                "isSuccess": true,
                                "data": [
                                    {
                                        "_id": "63a35edb3bb180f16ea32374",
                                        "event_id": "FB1010000000167165102859533603",
                                        "settings": {
                                            "orientation": "horizontal",
                                            "numberrating": 10,
                                            "scalecolor": "#aa0808",
                                            "roundcolor": "#2a5b74",
                                            "fontcolor": "#000000",
                                            "fomat": "numbers",
                                            "time": "120",
                                            "template_name": "TestSetting4834",
                                            "name": "TestSetting",
                                            "text": "Left+Center+Right",
                                            "left": "Left",
                                            "right": "Right",
                                            "center": "Center",
                                            "scale-category": "nps scale",
                                            "no_of_scales": "4"
                                        }
                                    },
                                    {
                                        "_id": "63a35f973bb180f16ea3238e",
                                        "event_id": "FB1010000000167165121658835342",
                                        "settings": {
                                            "orientation": "horizontal",
                                            "numberrating": 10,
                                            "scalecolor": "#ed0c0c",
                                            "roundcolor": "#4f2654",
                                            "fontcolor": "#000000",
                                            "fomat": "numbers",
                                            "time": "120",
                                            "template_name": "TestSetting1098",
                                            "name": "TestSetting",
                                            "text": "Left+Center+Right",
                                            "left": "Left",
                                            "right": "Right",
                                            "center": "Center",
                                            "scale-category": "nps scale",
                                            "no_of_scales": "4"
                                        }
                                    },
                                    {
                                        "_id": "63a360523bb180f16ea323b2",
                                        "event_id": "FB1010000000167165140457988274",
                                        "settings": {
                                            "orientation": "horizontal",
                                            "numberrating": 10,
                                            "scalecolor": "#ed0c0c",
                                            "roundcolor": "#4f2654",
                                            "fontcolor": "#000000",
                                            "fomat": "numbers",
                                            "time": "120",
                                            "template_name": "TestSetting2699",
                                            "name": "TestSetting",
                                            "text": "Left+Center+Right",
                                            "left": "Left",
                                            "right": "Right",
                                            "center": "Center",
                                            "scale-category": "nps scale",
                                            "no_of_scales": "4"
                                        }
                                    }
                                ]
                            }                            
            
                                
2.     Scale Responses
       1. Create Scale Response         Description: Provide a response to a particular scale instance using the corresponding scale details.
              - URL: (POST) https://100035.pythonanywhere.com/api/nps_responses_create
              - Body: {
                     "scale_id": "63e8b4c87f4aa8f650162b7a",
                     "instance_id":1 ,
                     "brand_name":"xyz000",
                     "product_name":"xyz000",
                     "score":7,
                     "username": "umarjaved"
                     }
              - Response: {
                         "success": "{\"isSuccess\": true, \"inserted_id\": \"647e3a97264adfc99d2736be\"}",
                         "score": {
                             "instance_id": "1/4",
                             "score": 7,
                             "category": "Neutral"
                         },
                         "payload": {
                             "event_id": "05:06:2023,19:42:15",
                             "scale_data": {
                                 "scale_id": "63e8b4c87f4aa8f650162b7a",
                                 "scale_type": "nps scale"
                             },
                             "brand_data": {
                                 "brand_name": "xyz000",
                                 "product_name": "xyz000"
                             },
                             "score": [
                                 {
                                     "instance_id": "1/4",
                                     "score": 7,
                                     "category": "Neutral"
                                 }
                             ]
                         },
                         "url": "https://100035.pythonanywhere.com/nps-scale1/testing5350?brand_name=WorkflowAI&product_name=editor/1",
                         "Category": "Neutral"
                     }                 
                     
           -----------------------------------------------------------------------------------------------------------------------------------                
              
       2. Get Single Scale Response
              - URL: (GET) https://100035.pythonanywhere.com/api/nps_responses/<str:scale_id>
                     e.g https://100035.pythonanywhere.com/api/nps_responses/647f261b7c6579b2466771bf
              - Body: None
              - Response: {
                         "payload": {
                             "isSuccess": true,
                             "data": [
                                 {
                                     "_id": "647f261b7c6579b2466771bf",
                                     "event_id": "06:06:2023,12:27:07",
                                     "scale_data": {
                                         "scale_id": "647f2305264adfc99d27417c",
                                         "scale_type": "nps scale"
                                     },
                                     "brand_data": {
                                         "brand_name": "my_brand_name",
                                         "product_name": "my_product_name"
                                     },
                                     "score": [
                                         {
                                             "instance_id": "1/1",
                                             "score": 7,
                                             "category": "Neutral"
                                         }
                                     ]
                                 }
                             ]
                         }
                     }
           ----------------------------------------------------------------------------------------------------------------------------------                
       3. Get All Scale Responses
              - URL: (GET) https://100035.pythonanywhere.com/api/nps_responses
              - Body: None
              - Response: {
                         "isSuccess": true,
                         "data": [
                                    {
                                        "_id": "63a477d49b0e8a8545b262a2",
                                        "event_id": "FB1010000000167172295758202024",
                                        "scale_data": {
                                            "scale_id": "63a403752be81449d3a32382",
                                            "scale_type": "nps scale",
                                            "instance_id": "3/4"
                                        },
                                        "brand_data": {
                                            "brand_name": "your_brand",
                                            "product_name": "your_product"
                                        },
                                        "score": {
                                            "score": "2"
                                        }
                                    },
                                    {
                                        "_id": "63a47a3b9b0e8a8545b26336",
                                        "event_id": "FB1010000000016717235725374497",
                                        "scale_data": {
                                            "scale_id": "63a403752be81449d3a32382",
                                            "scale_type": "nps scale"
                                        },
                                        "brand_data": {
                                            "brand_name": "your_brand",
                                            "product_name": "your_product"
                                        },
                                        "score": [
                                            {
                                                "instance_id": "4/4",
                                                "score": "10"
                                            }
                                        ]
                                    },
                                  ]  
                                  
4.     Calculate Total Score
       - URL (GET) https://100035.pythonanywhere.com/api/total_responses/<str:doc_no>/<str:product_name>
          e.g https://100035.pythonanywhere.com/api/total_responses/1/xyz000
       - Body: None
       - Response: {
                  "All_scores": [
                      2,
                      2,
                      2,
                      2,
                      4,
                      6,
                      9,
                      0
                  ],
                  "Total_score for document 1": 27
                  }        
             

5.     Custom Configuration Data
        1. Upload Custom Configuration Data
                - URL: (POST) https://100035.pythonanywhere.com/api/nps_custom_data/
                - Body: { 
                       "template_id": "27289",         
                        "scale_id": "63e8b4c87f4aa8f650162b7a",                   
                        "custom_input_groupings": {"t1": 101, "i1": 102},    
                        "scale_label": "scale_label" 
                      }
                - Response: {
                            "message": {
                                "isSuccess": true
                            },
                            "data": {
                                "template_id": "27289",
                                "custom_input_groupings": {
                                    "t1": 101,
                                    "i1": 102
                                },
                                "scale_id": "63e8b4c87f4aa8f650162b7a",
                                "scale_label": "scale_label",
                                "default_name": "scale_label",
                                "date_created": "2023-05-31 15:47:16"
                            }
                        }
                        ------------------------------------------------------------
        2. Update Custom Configuration Data
                    - URL: (PUT) https://100035.pythonanywhere.com/api/nps_custom_data/
                    - Body: {
                                "template_id": "27289",
                                "scale_id": "63e8b4c87f4aa8f650162b7a",
                                "custom_input_groupings": {"t1": 101, "i1": 103}
                            }
                    - Response: {
                                    "success": "Successfully Updated",
                                    "data": {
                                        "custom_input_groupings": {
                                            "t1": 101,
                                            "i1": 103
                                        },
                                        "scale_id": "63e8b4c87f4aa8f650162b7a",
                                        "template_id": "27289",
                                        "scale_label": null,
                                        "date_created": "2023-03-14 15:24:55",
                                        "date_updated": "2023-05-31 15:53:01"
                                    }
                                }
                          -----------------------------------------------------------------
        3. Get Custom Configuration Data of a particular scale_id
                - URL: (GET) https://100035.pythonanywhere.com/api/nps_custom_data/
                - Body: { "scale_id": "63e8b4c87f4aa8f650162b7a" }
                - Response: {
                            "data": {
                                "isSuccess": true,
                                "data": {
                                    "_id": "6410908c3881d99d01e66ac9",
                                    "template_id": "27289",
                                    "custom_input_groupings": {
                                        "t1": 105,
                                        "i1": 103
                                    },
                                    "scale_id": "63e8b4c87f4aa8f650162b7a",
                                    "date_created": "2023-03-14 15:24:55",
                                    "date_updated": "2023-06-03 12:15:59",
                                    "scale_label": null
                                }
                            }
                        }
=======
# 100035-DowellScale-Function

## NPS Scale APIs for data retrieval

## SETTINGS

### 1. Create a scale with a specific setting

#### Request METHOD : POST, PUT, GET
#### End-Point : https://100035.pythonanywhere.com/api/nps_settings_create/
#### If request METHOD : GET

```python
    {
    "scale_id": "63e8b4c87f4aa8f650162b7a",   #scale_id that you would wish to retrieve its details
    }
    
```
## Update Scale through Settings(PUT)
#### Request METHOD: GET
#### URL: https://100035.pythonanywhere.com/nps-editor/settings/<str:Mongodb_ID>
#### Example: https://100035.pythonanywhere.com/nps-editor/settings/63e8b4c87f4aa8f650162b7a


#### If request METHOD : PUT
#### pass any field you would love to update when calling the PUT request
#### Example of body. Its not a must all fields are provided, only provided fields will be updated without looasing the previous saved settings
```python
{
"scale_id": "63e8b4c87f4aa8f650162b7a" ,    #Scale ID is mandatory when sending PUT request.

"username": "your name",        #your username

"orientation": "horizontal",    #orientation of the scale- horizontal/ vertical

"scalecolor": "#8f1e1e",        #bg color of the scale

"roundcolor": "#938585",        #color of the buttons in the scale

"fontcolor": "#000000",        #color of the text inside the buttons

"fomat": "numbers",            #format in which you wish the response to be recorded- numbers, stars, emojis

"time": "60",                 #time limit in seconds that you wish to assign for providing each response- any natural no.

"name": "testAPI",            #name you wish to assign to the scale

"left": "good",               #label for the lowest rating (zero)- text

"right": "best",              #label for the highest rating (10)- text

"center": "neutral",          #label for  neutral ratings- text
}    
```

#### Example of the body to be sent in the API : POST

```python

{
"username": "your name",        #your username

"orientation": "horizontal",    #orientation of the scale- horizontal/ vertical

"scalecolor": "#8f1e1e",        #bg color of the scale

"roundcolor": "#938585",        #color of the buttons in the scale

"fontcolor": "#000000",        #color of the text inside the buttons

"fomat": "numbers",            #format in which you wish the response to be recorded- numbers, stars, emojis

"time": "60",                 #time limit in seconds that you wish to assign for providing each response- any natural no. Put time to 0 is you dont want timing on scale generated.

"name": "testAPI",            #name you wish to assign to the scale

"left": "good",               #label for the lowest rating (zero)- text

"right": "best",              #label for the highest rating (10)- text

"center": "neutral",          #label for  neutral ratings- text
}                                

```
### Response to API

```python
#Success
{
    "success": "{\"isSuccess\": true, \"inserted_id\": \"63e4c9676d29b0d8177814a4\"}",
    "payload": {
        "event_id": "FB1010000000167593814551606998",
        "settings": {
            "orientation": "horizontal",
            "numberrating": 10,
            "scalecolor": "#8f1e1e",
            "no_of_scales": 1,
            "roundcolor": "#938585",
            "fontcolor": "#000000",
            "fomat": "numbers",
            "time": "60",
            "template_name": "TestDic8931",
            "name": "TestDic",
            "text": "good+neutral+best",
            "left": "good",
            "right": "best",
            "center": "neutral",
            "scale-category": "nps scale",
        }
    },
    "scale_urls": "http://127.0.0.1:8000/nps-scale1/TestDic8931?brand_name=your_brand&product_name=product_name"
}

#Failure 
Response=({"error": "Invalid data provided."},status=status.HTTP_400_BAD_REQUEST)
```


### 2.Fetch the settings data for a particular scale using the template/ scale name
#### Request METHOD : GET/name (here, name is the scale name)
#### End-Point : https://100035.pythonanywhere.com/api/nps_settings/<str: template_name>


# RESPONSE (SCALE REPORTS)
### 1. Provide a response to a particular scale instance using the corresponding scale details
#### Request METHOD :  POST
#### End-Point : https://100035.pythonanywhere.com/api/nps_responses_create


### Example of the body to be sent in the API : 

```python
{

"template_name": "scale name",
#name of the parent scale

"scale_id": "mongodb doc id",
#document id of the parent scale

"instance_id":6 ,
#instance id of the instance you wish to provide a response to


"brand_name":"brand_name",
#name of the brand the scale is being used for


"product_name":"product_name",
#name of the product the scale is being used for


"score":7,
#the score you wish to assign as a response


"username": "your name"
#your user name

}


```

### 1. Dynamically generate instances
#### Request METHOD : POST 
#### End-Point : https://100035.pythonanywhere.com/api/nps_create_instance
```python
{   
    "scale_id":"63e8b9757f4aa8f650162bcc",       #scale_id you wish to generate instance
    "no_of_documents": 2                         #can be optional. If it is not provided the scale will only create one instance per request.
}

```
### 2. Fetch the response data for a single scale from the database
#### Request METHOD : GET/_id (here, the _id is the default mongo db _id)
#### End-Point : https://100035.pythonanywhere.com/api/nps_responses/<str: _id>

### 3.Fetch the response data for all NPS scales
#### Request METHOD : GET
#### End-Point : https://100035.pythonanywhere.com/api/nps_responses


## TOTAL SCORE

### 1.Fetch/calculate all scores of all instances of a particular scale using the unique template name
#### Request METHOD : GET/name (here, name is template_name)
#### End-Point : https://100035.pythonanywhere.com/api/total_responses/<str: template_name>

## NPS Scale APIs for data retrieval

## CUSTOM CONFIGURATIONS

### 1. Create/Retrieve/Update custom configurtions

#### Request METHOD : POST, PUT, GET
#### End-Point : https://100035.pythonanywhere.com/api/nps_custom_data_all
#### If request METHOD : GET

```python
    {
        "template_id": "47576",                              #template Id to retrieve all elements present in a template
    }
    
```
#### Request METHOD : POST, PUT, GET
#### End-Point : https://100035.pythonanywhere.com/api/nps_custom_data/
#### If request METHOD : GET

```python
    {
    "scale_id": "63e8b4c87f4aa8f650162b7a",   #scale_id that you would wish to retrieve its details
    }
    
```
#### If request METHOD : POST

```python
    {

        "template_id": "27289",                                          #Template id for the editor
        "scale_id": "63e8b4c87f4aa8f650162b7a",                          #Id for the current scale     
        "custom_input_groupings": {'t1': 'id', 'i1': 'id'}   #Groupings of elements related to the scale 
        "scale_label": "scale_label"                                     #Scale Label Provided by the user
    }
    
```

#### if request METHOD : PUT 
```python
    {

        "custom_input_groupings": {'t1': 'id', 'i1': 'id'}               #Groupings of elements related to the scale 
        "scale_label": "scale_label"                                     #Scale Label Provided by the user
    }
```
>>>>>>> update-staple-(POST)

