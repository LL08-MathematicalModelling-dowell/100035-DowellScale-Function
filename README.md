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
                        "label_images": {"0": "imagefile", "1": "imagefile", "2": "imagefile"},
                        "fontstyle": "Arial, Helvetica, sans-serif",
                        "emoji_format": {"0": "😀", "1": "😃", "2": "😄"}
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
                                }
             

2.      All custom configuration
        - URL: (POST) https://100035.pythonanywhere.com/api/nps_custom_data_all
        - Body: { "templated_id": 47576 }
        - Response: ---

3.     Custom Configuration Data
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

