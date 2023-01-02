import requests
import json
def get_user_profile(request, key):
    # code=request.GET.get('id',None)
    if key:
        url="https://100014.pythonanywhere.com/api/userinfo/"
        response=requests.post(url,data={"session_id":key})
        profile_detais= json.loads(response.text)
        user_role = request.session.get('role')
        return profile_detais



