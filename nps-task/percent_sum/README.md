## This is the official documentation for the DoWell Scale Percent Sum APIs
### ENDPOINTS FOR CREATING AND UPDATING Percent Sum SCALES   
1.      Scale Settings
        1. Upload Scale Settings
                - URL: (POST) https://100035.pythonanywhere.com/percent-sum/percent-sum-settings
                - Body: {
                        "username" : "pfactorial",
                        "time" : 100,
                        "scale_name" : "envue 2 scale",
                        "number_of_scales" : 1,
                        "orientation" : "vertical",
                        "scale_color" : "ffff",
                        "product_count" : 3,
                        "product_names" : ["brand2", "brand4", "brand5"],
                        "user" : "yes"
                        }
                - Response: {
                                "success": "{\"isSuccess\": true, \"inserted_id\": \"64ab1dee7df547ab0fefcb91\"}",
                                "data": {
                                    "event_id": "FB1010000000000000000000003004",
                                    "settings": {
                                        "orientation": "vertical",
                                        "scale_color": "ffff",
                                        "number_of_scales": 1,
                                        "time": 100,
                                        "name": "envue 2 scale",
                                        "scale-category": "percent_sum scale",
                                        "user": "yes",
                                        "product_names": [
                                            "brand2",
                                            "brand4",
                                            "brand5"
                                        ],
                                        "product_count": 3,
                                        "date_created": "2023-07-09 21:51:54"
                                    }
                                }
                            }
                
         2. Update Scale Settings
                - URL: (PUT) https://100035.pythonanywhere.com/percent-sum/percent-sum-settings
                - Body: {
                            "scale_id" : "64a6b2c00b4945419035af18",
                            "orientation" : "horizontal",
                            "scale_color" : "fffff",
                            "product_count" : 2,
                            "product_names" : ["brand3", "brand5"]
                        }
                 - Response: {
                                "success": "Successfully Updated ",
                                "data": {
                                    "orientation": "horizontal",
                                    "scale_color": "fffff",
                                    "number_of_scales": 1,
                                    "time": 100,
                                    "name": "envue 2 scale",
                                    "scale-category": "percent_sum scale",
                                    "user": "yes",
                                    "product_names": [
                                        "brand3",
                                        "brand5"
                                    ],
                                    "product_count": 2,
                                    "date_created": "2023-07-06 13:25:35",
                                    "date_updated": "2023-07-09 21:55:55"
                                }
                            }
                  
          3. Get Scale Settings
                    - URL (GET) https://100035.pythonanywhere.com/percent-sum/percent-sum-settings
                    - Body:   {"scale_id" : "64a6b2c00b4945419035af18"}
                    - Response: {
                                "data": {
                                    "isSuccess": true,
                                    "data": [
                                        {
                                            "_id": "64ab1dee7df547ab0fefcb91",
                                            "event_id": "FB1010000000000000000000003004",
                                            "settings": {
                                                "orientation": "vertical",
                                                "scale_color": "ffff",
                                                "number_of_scales": 1,
                                                "time": 100,
                                                "name": "envue 2 scale",
                                                "scale-category": "percent_sum scale",
                                                "user": "yes",
                                                "product_names": [
                                                    "brand2",
                                                    "brand4",
                                                    "brand5"
                                                ],
                                                "product_count": 3,
                                                "date_created": "2023-07-09 21:51:54"
                                            }
                                        }
                                    ]
                                }
                            }             
            

### ENDPOINTS FOR PROVIDING RESPONSE (RATING) TO A PERCENT SUM SCALE
                                  
