import json
import requests
import logging

from functools import partial
from datetime import datetime

def log_api_downtime(api_name, error_message , status_code):
    logger = logging.getLogger('external_api')
    logger.error(f"[{datetime.now().strftime('%d/%b/%Y %H:%M:%S')}] - API '{api_name}' is down: {error_message} - {status_code} ")


def dowell_time(timezone):
    url = "https://100009.pythonanywhere.com/dowellclock/"
    payload = json.dumps({
        "timezone":timezone,
        })
    headers = {
        'Content-Type': 'application/json'
        }

    response = requests.request("POST", url, headers=headers, data=payload)

    if response.status_code == 200:
        res= json.loads(response.text)

    else:
        import pytz
        from datetime import datetime   

        timezone = pytz.timezone('Asia/Calcutta')

        current_time = datetime.now(timezone)
        
        res = {"current_time" : current_time.strftime("%Y-%m-%d %H:%M:%S")}

        log_api_downtime("dowell clock" , response.text , response.status_code)
    print(res)
    return res


dowell_time_asian_culta = partial(dowell_time , "Asia/Calcutta")