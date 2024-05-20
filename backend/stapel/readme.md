## This is the official documentation for the DoWell Staple Scale APIs
### ENDPOINTS FOR CREATING AND UPDATING STAPLE SCALES   
1.      Staple Scale Settings
        1. Upload Staple Scale Settings
                - URL: (POST) https://100035.pythonanywhere.com/stapel/api/stapel_settings_create/
                - Body: {
                          "username": "Natan",
                          "orientation": "horizontal",
                          "spacing_unit": 1,
                          "scale_upper_limit": 10,
                          "scalecolor": "#8f1e1e",
                          "roundcolor": "#938585",
                          "fontcolor": "#000000",
                          "fomat": "emoji",
                          "time": "60",
                          "name": "scalename",
                          "left": "very good",
                          "right": "very good",
                          "label_images": {"0": "imagefile", "1": "imagefile", "2": "imagefile"},
                          "fontstyle": "Arial, Helvetica, sans-serif",
                          "custom_emoji_format": {"0": "😎", "1": "🤓", "2": "😊"}
                      }  
                - Response: {
                              "success": "{\"isSuccess\": true, \"inserted_id\": \"6486f24599931cad638e888d\"}",
                              "data": {
                                  "event_id": "FB1010000000016865654395968247",
                                  "settings": {
                                      "orientation": "horizontal",
                                      "spacing_unit": 1,
                                      "scale_upper_limit": 10,
                                      "scale_lower_limit": -10,
                                      "scalecolor": "#8f1e1e",
                                      "roundcolor": "#938585",
                                      "fontcolor": "#000000",
                                      "fomat": "numbers",
                                      "time": "60",
                                      "template_name": "scalename3559",
                                      "name": "scalename",
                                      "text": "very bad+very good",
                                      "left": "very bad",
                                      "right": "very good",
                                      "scale": [
                                          -10,
                                          -9,
                                          -8,
                                          -7,
                                          -6,
                                          -5,
                                          -4,
                                          -3,
                                          -2,
                                          -1,
                                          1,
                                          2,
                                          3,
                                          4,
                                          5,
                                          6,
                                          7,
                                          8,
                                          9,
                                          10
                                      ],
                                      "scale-category": "stapel scale",
                                      "no_of_scales": 1,
                                      "date_created": "2023-06-12 10:24:05"
                                  }
                              }
                          }
                
         2. Update Staple Scale Settings
                - URL: (PUT) https://100035.pythonanywhere.com/stapel/api/stapel_settings_create/
                - Body: {
                          "scale_id": "63f5114bbfefc8f7e5d5d617",
                          "fomat": "emoji",
                          "scale_upper_limit": 10,
                          "time": "60",
                          "name": "scalename",
                          "left": "very good",
                          "right": "very good",
                          "label_images": {"0": "imagefile", "1": "imagefile", "2": "imagefile"},
                          "fontstyle": "Arial, Helvetica, sans-serif",
                          "custom_emoji_format": {"0": "😎", "1": "🤓", "2": "😎"}
                      }
                 - Response: {
                              "success": "Successful Updated ",
                              "data": {
                                  "settings": {
                                      "orientation": "horizontal",
                                      "scale_upper_limit": 10,
                                      "scale_lower_limit": -10,
                                      "scalecolor": "#ed2602",
                                      "spacing_unit": "3",
                                      "no_of_scales": "1",
                                      "roundcolor": "#d51010",
                                      "fontcolor": "#35a80b",
                                      "fomat": "emoji",
                                      "time": "60",
                                      "template_name": "StapelApi",
                                      "name": "StapelApi",
                                      "text": "very good+very good",
                                      "left": "very good",
                                      "right": "very good",
                                      "scale": [
                                          -9,
                                          -6,
                                          -3,
                                          3,
                                          6,
                                          9
                                      ],
                                      "scale-category": "stapel scale",
                                      "date_updated": "2023-06-19 15:53:34",
                                      "custom_emoji_format": {
                                          "0": "😎",
                                          "1": "🤓",
                                          "2": "😎"
                                      }
                                  }
                              }
                          }
                  
          3. Get Scale Settings
                    - URL (GET) https://100035.pythonanywhere.com/stapel/api/stapel_settings_create/
                    - Body:   {"scale_id": "6486f24599931cad638e888d"}
                    - Response: {
                                  "data": {
                                      "isSuccess": true,
                                      "data": [
                                          {
                                              "_id": "6486f24599931cad638e888d",
                                              "event_id": "FB1010000000016865654395968247",
                                              "settings": {
                                                  "orientation": "horizontal",
                                                  "spacing_unit": 1,
                                                  "scale_upper_limit": 10,
                                                  "scale_lower_limit": -10,
                                                  "scalecolor": "#8f1e1e",
                                                  "roundcolor": "#938585",
                                                  "fontcolor": "#000000",
                                                  "fomat": "numbers",
                                                  "time": "60",
                                                  "template_name": "scalename3559",
                                                  "name": "scalename",
                                                  "text": "very bad+very good",
                                                  "left": "very bad",
                                                  "right": "very good",
                                                  "scale": [
                                                      -10,
                                                      -9,
                                                      -8,
                                                      -7,
                                                      -6,
                                                      -5,
                                                      -4,
                                                      -3,
                                                      -2,
                                                      -1,
                                                      1,
                                                      2,
                                                      3,
                                                      4,
                                                      5,
                                                      6,
                                                      7,
                                                      8,
                                                      9,
                                                      10
                                                  ],
                                                  "scale-category": "stapel scale",
                                                  "no_of_scales": 1,
                                                  "date_created": "2023-06-12 10:24:05"
                                              }
                                          }
                                      ]
                                  }
                              }
                   
           4. Get All Scale Settings
                     - URL: (GET) https://100035.pythonanywhere.com/stapel/api/stapel_settings
                     - Body: None    
                     - Response: {
                                "isSuccess": true,
                                "data": [
                                    {
                                        "_id": "63a76143755ae14e588fad58",
                                        "event_id": "FB1010000000167191378951958773",
                                        "settings": {
                                            "orientation": "horizontal",
                                            "scale_upper_limit": 10,
                                            "scale_lower_limit": -10,
                                            "scalecolor": "#ca1616",
                                            "roundcolor": "#4155ec",
                                            "fontcolor": "#000000",
                                            "fomat": "numbers",
                                            "time": "0",
                                            "template_name": "TestTime6798",
                                            "name": "TestTime",
                                            "text": "Left+Right",
                                            "left": "Left",
                                            "right": "Right",
                                            "scale": [
                                                -10,
                                                -8,
                                                -6,
                                                -4,
                                                -2,
                                                2,
                                                4,
                                                6,
                                                8,
                                                10
                                            ],
                                            "scale-category": "stapel scale",
                                            "no_of_scales": "13"
                                        }
                                    },
                                    {
                                        "_id": "63a76606755ae14e588faddd",
                                        "event_id": "FB1010000000167191500856390314",
                                        "settings": {
                                            "orientation": "horizontal",
                                            "scale_upper_limit": 10,
                                            "scale_lower_limit": -10,
                                            "scalecolor": "#c84141",
                                            "roundcolor": "#5ae0f2",
                                            "fontcolor": "#000000",
                                            "fomat": "numbers",
                                            "time": "",
                                            "template_name": "TestSetting136",
                                            "name": "TestSetting",
                                            "text": "Left+Right",
                                            "left": "Left",
                                            "right": "Right",
                                            "scale": [
                                                -10,
                                                -8,
                                                -6,
                                                -4,
                                                -2,
                                                2,
                                                4,
                                                6,
                                                8,
                                                10
                                            ],
                                            "scale-category": "stapel scale",
                                            "no_of_scales": "14"
                                        }
                                    },                           
            

### ENDPOINTS FOR PROVIDING RESPONSE (RATING) TO A STAPLE SCALE
2.     Staple Scale Responses
       1. Create Staple Scale Response
          Description: Provide a response to a particular staple scale instance using the corresponding scale details.
              - URL: (POST) https://100035.pythonanywhere.com/stapel/api/stapel_responses_create/
              - Body: {
                        "username": "Natan",
                        "scale_id" : "64908280aa87c9148790a8ee",
                        "score": 5,
                        "instance_id": 1,
                        "brand_name": "brand envue",
                        "product_name": "envue"
                    }
              - Response: {
                            "success": "{\"isSuccess\": true, \"inserted_id\": \"64909ee7aa87c9148790aa0e\"}",
                            "payload": {
                                "event_id": "FB1010000000016871994575505699",
                                "scale_data": {
                                    "scale_id": "64908280aa87c9148790a8ee",
                                    "scale_type": "stapel scale"
                                },
                                "brand_data": {
                                    "brand_name": "brand envue",
                                    "product_name": "envue"
                                },
                                "score": [
                                    {
                                        "instance_id": "1/1",
                                        "score": 5
                                    }
                                ]
                            },
                            "total score": 0
                        }        
                                    
              
       2. Get Single Staple Scale Response
              - URL: (GET) https://100035.pythonanywhere.com/stapel/api/stapel_responses/<str:scale_id>
                     e.g https://100035.pythonanywhere.com/stapel/api/stapel_responses/64909ee7aa87c9148790aa0e
              - Body: None
              - Response: {
                          "payload": {
                              "isSuccess": true,
                              "data": [
                                  {
                                      "_id": "64909ee7aa87c9148790aa0e",
                                      "event_id": "FB1010000000016871994575505699",
                                      "scale_data": {
                                          "scale_id": "64908280aa87c9148790a8ee",
                                          "scale_type": "stapel scale"
                                      },
                                      "brand_data": {
                                          "brand_name": "brand envue",
                                          "product_name": "envue"
                                      },
                                      "score": [
                                          {
                                              "instance_id": "1/1",
                                              "score": 5
                                          }
                                      ]
                                  }
                              ]
                          }
                        }
                  
       3. Get All Staple Scale Responses
              - URL: (GET) https://100035.pythonanywhere.com/stapel/api/stapel_responses
              - Body: None
              - Response: {
                            "isSuccess": true,
                            "data": [
                                {
                                    "_id": "63a77a1e71cb37d87e8fa68a",
                                    "event_id": "FB1010000000167192014859685411",
                                    "scale_data": {
                                        "scale_id": "63a777a7755ae14e588fafe2",
                                        "scale_type": "stapel scale"
                                    },
                                    "brand_data": {
                                        "brand_name": "your_brand",
                                        "product_name": "your_product"
                                    },
                                    "score": [
                                        {
                                            "instance_id": "2/3",
                                            "score": "-2"
                                        }
                                    ]
                                },
                                {
                                    "_id": "63aace4331f7d7aa091c7c74",
                                    "event_id": "FB1010000000167213829750744584",
                                    "scale_data": {
                                        "scale_id": "63aacdc731f7d7aa091c7c1d",
                                        "scale_type": "stapel scale"
                                    },
                                    "brand_data": {
                                        "brand_name": "your_brand",
                                        "product_name": "your_product"
                                    },
                                    "score": [
                                        {
                                            "instance_id": "test4199?brand_name=your_brand&product_name=your_product/5",
                                            "score": "-2"
                                        }
                                    ]
                                },
                                {
                                    "_id": "63c53477f5d416c71913757f",
                                    "event_id": "FB1010000000016738684015115113",
                                    "scale_data": {
                                        "scale_id": "63ae908353bd3b33296ee24f",
                                        "scale_type": "stapel scale"
                                    },
                                    "brand_data": {
                                        "brand_name": "your_brand",
                                        "product_name": "your_product"
                                    },
                                    "score": [
                                        {
                                            "instance_id": "2/100",
                                            "score": "6"
                                        }
                                    ]
                                },
                                {
                                    "_id": "64909ee7aa87c9148790aa0e",
                                    "event_id": "FB1010000000016871994575505699",
                                    "scale_data": {
                                        "scale_id": "64908280aa87c9148790a8ee",
                                        "scale_type": "stapel scale"
                                    },
                                    "brand_data": {
                                        "brand_name": "brand envue",
                                        "product_name": "envue"
                                    },
                                    "score": [
                                        {
                                            "instance_id": "1/1",
                                            "score": 5
                                        }
                                    ]
                                }
                            ]
                        }
