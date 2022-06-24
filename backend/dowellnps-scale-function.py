from pymongo import MongoClient
from tkinter import *
from bson.objectid import ObjectId
import webbrowser


def custom_settings():
    while True:
        try:
            direction = input("Select direction ('horizontal' or 'vertical') \n> ")
            if direction.lower() == "horizontal" or direction.lower() == "vertical":
                color = input("Do you want color? ('True' or 'False')\n> ")
                if color.lower() == "true":
                    hex_color = input("Enter Hex color ('#fff') \n> ")
                    if hex_color[0] == "#":
                        timing = input("Do you want timing? ('True' or 'False')\n> ")
                        if timing.lower() == "true":
                            time = int(input("Enter time in seconds\n> "))
                            if time != "" and time > 0:
                                label = input("Select label ('text' or 'image') \n> ")
                                if label.lower() == "text" or label.lower() == "image":
                                    if label.lower() == "text":
                                        labelA = input("Select text for marking beginning of label ('won't recommended') \n> ")
                                        if labelA != "":
                                            labelB = input("Select text for marking end of label ('highly recommended') \n> ")
                                            if labelB != "":
                                                pass
                                                # print("Settings saved successfully!")
                                        else:
                                            print("Invalid Label!")
                                    else:
                                        # print("Settings saved successfully!")
                                        labelA = ""
                                        labelB = ""
                                else:
                                    print("Choose either text or image!")
                            else:
                                print("Enter valid time")
                        elif timing.lower() == "false":
                            time = ""
                            label = input("Select label ('text' or 'image') \n> ")
                            if label.lower() == "text" or label.lower() == "image":
                                if label.lower() == "text":
                                    labelA = input("Select text for marking beginning of label ('won't recommended') \n> ")
                                    if labelA != "":
                                        labelB = input("Select text for marking end of label ('highly recommended') \n> ")
                                        if labelB != "":
                                            pass
                                            # print("Settings saved successfully!")
                                    else:
                                        print("Invalid Label!")
                                else:
                                    # print("Settings saved successfully!")
                                    labelA = ""
                                    labelB = ""
                            else:
                                print("Choose either text or image!")

                        else:
                            print("Invalid choice!")
                    else:
                        print("Invalid Hex format!")
                elif color.lower() == "false":
                    hex_color = "#fff"
                    timing = input("Do you want timing? ('True' or 'False')\n> ")
                    if timing.lower() == "true":
                        time = int(input("Enter time in seconds\n> "))
                        if time != "" and time > 0:
                            label = input("Select label ('text' or 'image') \n> ")
                            if label.lower() == "text" or label.lower() == "image":
                                if label.lower() == "text":
                                    labelA = input("Select text for marking beginning of label ('won't recommended') \n> ")
                                    if labelA != "":
                                        labelB = input("Select text for marking end of label ('highly recommended') \n> ")
                                        if labelB != "":
                                            pass
                                            # print("Settings saved successfully!")
                                    else:
                                        print("Invalid Label!")
                                else:
                                    labelA = ""
                                    labelB = ""
                                    # print("Settings saved successfully!")
                            else:
                                print("Choose either text or image!")
                        else:
                            print("Enter valid time")
                    elif timing.lower() == "false":
                        time = ""
                        label = input("Select label ('text' or 'image') \n> ")
                        if label.lower() == "text" or label.lower() == "image":
                            if label.lower() == "text":
                                labelA = input("Select text for marking beginning of label ('won't recommended') \n> ")
                                if labelA != "":
                                    labelB = input("Select text for marking end of label ('highly recommended') \n> ")
                                    if labelB != "":
                                        pass
                                        # print("Settings saved successfully!")
                                else:
                                    print("Invalid Label!")
                            else:
                                labelA = ""
                                labelB = ""
                                # print("Settings saved successfully!")
                        else:
                            print("Choose either text or image!")
                    else:
                        print("Invalid choice!")
                else:
                    print("Invalid choice!")
            else:
                print("Invalid choice!")
            dowellnps_scale_function(direction, color, hex_color, timing, time, label, labelA, labelB)
            break
        except:
            print("Please confirm your inputs!")


def dowellnps_scale_function(direction, color, hex_color, timing, time, label, labelA, labelB):
    cluster = MongoClient("mongodb+srv://Ambrose:ambrose@cluster0.tlpb9.mongodb.net/test")
    db = cluster["dowellnps_scale_function"]
    collection = db["system_settings"]
    user_score = db["response"]
    scale = []
    scale_limit = 10
    spacing_unit = 1
    for i in range(0, scale_limit + 1):
        scale.append(i)

    if label == "image":
        labelSave = f"{scale[0]}=\U0001F642,{scale[-1]}=\U0001F642"
    else:
        labelSave = f"{scale[0]}= {labelA},{scale[-1]}={labelB}"

    if color == False:
        hex_color = "#fff"
    # elif timing == False:
    #     time = ""

    settings = {"direction": direction, "color": color, "hex_color": hex_color, "timing": timing, "time": time, "label_type": label,"scale_limit": scale_limit, "spacing_unit": spacing_unit, "scale": scale,"labelA":labelA, "labelB":labelB, "label": labelSave}
    user_input = {}


    window = Tk()
    window.title("NPS SCALE")
    window.resizable(0, 0)
    if label == "text" and direction == "horizontal":
        Label(window, text=labelA, bg="#fff", font=("bold", 6)).place(x=40, y=130)
        Label(window, text=labelB, bg="#fff", font=("bold", 6)).place(x=530, y=130)
    elif label == "text" and direction == "vertical":
        Label(window, text=labelA, bg="#fff", font=("bold", 6)).place(x=94, y=62.5)
        Label(window, text=labelB, bg="#fff", font=("bold", 7)).place(x=96, y=560)
    elif label == "image" and direction == "vertical":
        Label(window, text="😄",  fg="red", font=("bold", 20)).place(x=100, y=50)
        Label(window, text='😠', fg="red", font=("bold", 20)).place(x=102, y=550)
    elif label == "image" and direction == "horizontal":
        Label(window, text="😄", fg="red", font=("bold", 20)).place(x=52.5, y=130)
        Label(window, text='😠', fg="red", font=("bold", 20)).place(x=552.5, y=130)
    if direction == "horizontal":
        window.geometry("650x200")
        Label(window, text="SCALE", fg="green", bg="lightblue", font=("bold", 24), padx=275).grid(column=1, row=1)

        digits = {
            0: (50, 80), 1: (100, 80), 2: (150, 80),
            3: (200, 80), 4: (250, 80), 5: (300, 80),
            6: (350, 80), 7: (400, 80), 8: (450, 80),
            9: (500, 80), 10: (550, 80)
        }

        def add_to_expression(value):
            current_expression = ""
            current_expression += str(value)
            user_input["score"] = int(current_expression)
            if user_input["score"] <= 6:
                user_input["category"] = "Detractor"
            elif user_input["score"] <= 8:
                user_input["category"] = "Neutral"
            else:
                user_input["category"] = "Promoter"

            print("\nYour saved settings: \n", settings,"\nYour saved score: \n", user_input)
            if time == "":
                print("\n\x1B[3m<Please exit the scale to save your settings>\x1B[0m\n")

        def create_digit_buttons():
            for digit, grid_value in digits.items():
                button = Button(window, text=str(digit), bg=hex_color, fg="black", font=("Arial Bold", 10, "bold"),
                                borderwidth=0, command=lambda x=digit: add_to_expression(x))

                button.place(x=grid_value[0], y=grid_value[1])

        create_digit_buttons()
    else:
        window.geometry("200x630")

        Label(window, text="SCALE", fg="green", bg="lightblue", font=("bold", 24), padx=50).grid(column=0, row=1)
        digits = {
            0: (50, 50), 1: (100, 50), 2: (150, 50),
            3: (200, 50), 4: (250, 50), 5: (300, 50),
            6: (350, 50), 7: (400, 50), 8: (450, 50),
            9: (500, 50), 10: (550, 50)
        }

        def add_to_expression(value):
            current_expression = ""
            current_expression += str(value)
            user_input["score"] = int(current_expression)
            if user_input["score"] <= 6:
                user_input["category"] = "Detractor"
            elif user_input["score"] <= 8:
                user_input["category"] = "Neutral"
            else:
                user_input["category"] = "Promoter"


            print("\nYour saved settings: \n", settings,"\nYour saved score: \n", user_input)
            if time == "":
                print("\n\x1B[3m<Please exit the scale to save your settings>\x1B[0m\n")

        def create_digit_buttons():
            for digit, grid_value in digits.items():
                button = Button(window, text=str(digit), bg=hex_color, fg="black", font=("Arial Bold", 10, "bold"),
                                borderwidth=0, command=lambda x=digit: add_to_expression(x))

                button.place(y=grid_value[0], x=grid_value[1])

        create_digit_buttons()
    print("\x1B[3mChoose Scale Value\x1B[0m")
    if time != "":
        window.after(time*1000, lambda: window.destroy())
    
    window.mainloop()

    change = input("Want to change settings? (Yes or No)\n> ")
    if change.lower() == "yes":
        setting_type = input("Do you wish to apply 'custom' or 'system' settings?\n> ")
        if setting_type.lower() == "custom":
            custom_settings()
        elif setting_type.lower() == "system":
            x = collection.find({})
            for i in x:
                print(i)
            setting = input("\nselect setting by id.\n> ")
            try:
                selected = collection.find_one({"_id": ObjectId(setting)})
                direction = selected["direction"]
                color = selected["color"]
                hex_color = selected["hex_color"]
                timing = selected["timing"]
                time = selected["time"]
                label = selected["label_type"]
                labelA = selected["labelA"]
                labelB = selected["labelB"]
                dowellnps_scale_function(direction, color, hex_color, timing, time, label, labelA, labelB)
            except:
                print("Invalid id!!")
    elif change.lower() == "no":
        b = collection.insert_one(settings)
        print(b.inserted_id)
        
        # last = collection.find().limit(1).sort([('$natural',-1)])
        # for i in last:
        #     user_input["_id"] = i["_id"]
        #     print(i["_id"])

        if user_input:
            user_input["_id"] = b.inserted_id
            user_score.insert_one(user_input)
            print("Settings & Score saved")
        else:
            print("Settings saved!")
    else:
        print("Invalid Input")
    return settings


# while True:
#     try:
#         input_type = input("Are you a Developer or Client? (Type \x1B[3mC\x1B[0m for Client \x1B[3mF\x1B[0m for Front end programmer)\n> ")
#         if input_type.lower() == "c" or input_type.lower() == "f":
#             role = input("Are you an Admin or User? (Type \x1B[3mA\x1B[0m for Admin \x1B[3mU\x1B[0m for User)\n> ")
#             if role.lower() == "a" or role.lower() == "u":
#                 break
#             else:
#                 print("Invalid value!")
#         else:
#             print("Invalid value!")
#     except:
#         print("Invalid value!")


# if input_type.lower() == "f" and role.lower() == "a":
#     dowellnps_scale_function("horizontal", True, "#fff", True, 60, "text", "Won't recommend", "Highly recommend")
# elif input_type.lower() == "f" and role.lower() == "u":
#     print("redirect to the response front end screen where the client can provide only response to the scale")
#     webbrowser.open_new("http://localhost:3000/response")
# elif input_type.lower() == "c" and role.lower() == "a":
#     print("redirect to the scale creation frontend screen where the client can assign the values to the input variables via the forms ")
#     webbrowser.open_new("http://localhost:3000/")
# elif input_type.lower() == "c" and role.lower() == "u":
#     print("redirect to the response front end screen where the client can provide only response to the scale")
#     webbrowser.open_new("http://localhost:3000/response")
# else:
#     print("Rerun function")

dowellnps_scale_function("horizontal", True, "#fff", True, 60, "text", "Won't recommend", "Highly recommend")