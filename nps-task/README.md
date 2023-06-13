# 100035-DowellScale-Function


# Create Instance

It creates Dynamic Instance by taking Scale Id as parameter like:

Request: POST

```bash
https://100035.pythonanywhere.com/api/nps_create_instance
```
With Body (payload):

```bash
{
"scale_id": "63e8b4c87f4aa8f650162b7a"
}
```

It will Generate output response:
```bash
{
    "success": "{\"isSuccess\": true}",
    "response": {
        "orientation": "horizontal",
        "scalecolor": "green",
        "numberrating": 10,
        "no_of_scales": 1,
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
        "date_updated": "2023-06-03 12:21:46",
        "allow_resp": true,
        "instances": [
            {
                "document1": "https://100035.pythonanywhere.com/nps-scale1/testing5350?brand_name=WorkflowAI&product_name=editor/1"
            }
        ]
    }
}
```

## Create Response
Provide a response to a particular scale instance using the corresponding scale details.

Request: POST 
like:

```bash
https://100035.pythonanywhere.com/api/nps_responses_create
```
with body (details that you have to Provide):
```bash
{

"template_name": "nps",
"scale_id": "63e8b4c87f4aa8f650162b7a",
"instance_id":1 ,
"brand_name":"xyz000",
"product_name":"xyz000",
"score":7,
"username": "umarjaved"
}
```

you will get response with instance detail and link to which you can give Score response:
```bash
{
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
```
## New NPS create

Create a scale with a specific setting

Request: POST

```bash
https://100035.pythonanywhere.com/api/nps_create/
```
with body:

```bash
{
"scale_id": "63e8b4c87f4aa8f650162b7a" ,    #Scale ID is mandatory when sending PUT request.
"user": "boolean",              #response is either a yes or no to distinguish between a front end programmer / end user providing the settings. No for frontend (cannot change settings provided), Yes for end user
"username": "your name",        #your username
"orientation": "horizontal",    #orientation of the scale- horizontal/ vertical
"scalecolor": "#8f1e1e",        #bg color of the scale
"roundcolor": "#938585",        #color of the buttons in the scale
"fontcolor": "#000000",        #color of the text inside the buttons
"fomat": "numbers",            #format in which you wish the response to be recorded- numbers, stars, emojis
"no_of_scales": 6,            #Specify number of scales to be created with the same settings (1-100)
"time": "60",                 #time limit in seconds that you wish to assign for providing each response- any natural no.
"name": "testAPI",            #name you wish to assign to the scale
"left": "good",               #label for the lowest rating (zero)- text
"right": "best",              #label for the highest rating (10)- text
"center": "neutral",          #label for  neutral ratings- text
"label_images": {0: imagefile, 1: imagefile, 2: imagefile ...}  #if user selects image as the format pass the images along with the scale default labels in a dictionary.
"fontstyle": "Arial, Helvetica, sans-serif"  #font style of the scale labels
"emoji_format": {0: 😀, 1: 😃, 2: 😄 ...}  #if user selects emoji as the format pass the emojis along with the scale default labels in a dictionary.
}    
```

## Get scale Settings
This Request gets the Details of All APIs present with their Setting Details.

Note:

No Arguments needed

Request: GET

```bash
https://100035.pythonanywhere.com/api/nps_settings
```

it show all scales with their settings like:

```bash
{
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
```

## Calculate Total Score

It will show all user response Scores with the reference to document.

Request: GET

```bash
https://100035.pythonanywhere.com/api/total_responses/<str:doc_no>/<str:product_name>
```

like 
```bash
https://100035.pythonanywhere.com/api/total_responses/1/xyz000
```

which will provide the response:

```bash
{
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
```
## NPS settings
Get setting details of Scale.

Request: GET
```bash 
https://100035.pythonanywhere.com/api/nps_settings/<str:template_name>
```
like:

```bash 
https://100035.pythonanywhere.com/api/nps_settings/TestDic8931
```
Response will be like this:

```bash
{
    "payload": {
        "isSuccess": true,
        "data": [
            {
                "_id": "63e4c9676d29b0d8177814a4",
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
                    "custom_input_id": "879646",
                    "custom_input_groupings": "{'Group1': {'key1': 'value1', 'key2': 'value2'}",
                    "custom_input_3": "",
                    "custom_input_4": "",
                    "custom_input_5": "",
                    "custom_input_6": "",
                    "custom_input_7": "",
                    "custom_input_8": "",
                    "show_total_score": "true"
                }
            }
        ]
    },
    "urls": [
        "https://100035.pythonanywhere.com/nps-scale1/TestDic8931?brand_name=WorkflowAI&product_name=editor/1"
    ]
}
```
## Single Scale Response

This API gets Single the Single Scale Response through Scale_id and gets the Data within that Scale.

Requst: GET

```bash
https://100035.pythonanywhere.com/api/nps_responses/<str:Scale_id>
```
like:
```bash
https://100035.pythonanywhere.com/api/nps_responses/63e8b4c87f4aa8f650162b7a
```

which will provide the Response like:

```bash
{
    "payload": {
        "isSuccess": true,
        "data": []
    }
}
```
## NPS responses

This Request gets the Details of All APIs present with their Response Details.

Note:

No Arguments needed

Request: GET

```bash
https://100035.pythonanywhere.com/api/nps_responses
```

Which will get the response:

```bash
{
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
        }
    ]
}
```








