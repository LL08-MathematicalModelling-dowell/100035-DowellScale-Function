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
                     "template_name": "nps",
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

