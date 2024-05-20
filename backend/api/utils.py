import json
import requests
import logging

from functools import partial

def log_api_downtime(api_name, error_message):
    logger = logging.getLogger('external_api')
    logger.error(f"API '{api_name}' is down: {error_message}")


def dowell_time(timezone):
    url = "https://100009.pythonanywhere.com/dowellclock/"
    payload = json.dumps({
        "timezone":timezone,
        })
    headers = {
        'Content-Type': 'application/json'
        }

    response = requests.request("POST", url, headers=headers, data=payload)

    if response.status_code != 200:
        res= json.loads(response.text)

    else:
        import pytz
        from datetime import datetime   

        timezone = pytz.timezone('Asia/Calcutta')

        current_time = datetime.now(timezone)
        
        res = {"current_time" : current_time.strftime("%Y-%m-%d %H:%M:%S")}

        log_api_downtime("dowell clock" , "Some is bad")

    return res


dowell_time_asian_culta = partial(dowell_time , "Asia/Calcutta")