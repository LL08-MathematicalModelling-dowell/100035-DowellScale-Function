def assign_statement(label_selection, selected_emoji):
    map = {
        2: {
            0 : "No",
            1 : "Yes"
        },
        3: {
            0 : "Disagree",
            1 : "Neutral",
            2 : "Agree"
        },
        4: {
            0 : "Strongly Disagree",
            1 : "Disagree",
            2 : "Agree",
            3 : "Strongly Agree",
        },
        5: {
            0 : "Strongly Disagree",
            1 : "Disagree",
            2 : "Neutral",
            3 : "Agree",
            4 : "Strongly Agree",
        },
        7: {
            0 : "Strongly Disagree",
            1 : "Disagree",
            2 : "Somewhat Disagree",
            3 : "Neutral",
            4 : "Somewhat Agree",
            5 : "Agree",
            6 : "Strongly Agree",
        },
        9: {
            0 : "Strongly Disagree",
            1 : "Disagree",
            2 : "Moderately Disagree",
            3 : "Mildly Disagree",
            4 : "Neutral",
            5 : "Mildly Agree",
            6 : "Moderately Agree",
            7 : "Agree",
            8 : "Strongly Agree",
        },
    }
    return map[label_selection][selected_emoji]