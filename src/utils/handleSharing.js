export default async function handleSharing(formData,setButtonLinks,setButtonLinksGenerated,scaleType,setSubmitted,setErr) {
  let axis_limit=scaleType=="stapel"?5:0
//   let pointers=scaleType=="likert"?5:0
setSubmitted(true)
const userinfo = JSON.parse(sessionStorage.getItem('userInfo'));

    try {
        let { channels } = formData;
        let channelInstanceList = [];

  
        channels.forEach((channel, channelIndex) => {
            let instancesDetails = [];


            channel.instances.forEach((instance, instanceIndex) => {
                instancesDetails.push({
                    instance_name: `instance_${instanceIndex + 1}`,
                    instance_display_name: instance
                });
            });

            channelInstanceList.push({
                channel_name: `channel_${channelIndex + 1}`,
                channel_display_name: channel.channelName,
                instances_details: instancesDetails
            });
        });
     
    
        let requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "workspace_id": userinfo.userinfo.client_admin_id,
                "username": "CustomerSupport",
                "scale_name": formData.scaleName,
                "channel_instance_list":channelInstanceList,
                "scale_type": scaleType,
                "user_type": true,
                "no_of_responses":100000,
               "axis_limit":axis_limit,
               "pointers":Number(formData.likertPointers[0]) || 0
            }
            )
        };


        const response = await fetch(
            "https://100035.pythonanywhere.com/addons/create-scale/v3/",
            requestOptions
        );
        const data = await response.json();



        if (data.urls && data.urls.length > 0) {
           // const instanceURL = data.urls[0].urls[0].instance_urls;
            setButtonLinks(data.urls)
            setButtonLinksGenerated(true)
           
            console.log(instanceURL);
        }
    } catch (error) {
        setErr("Check details and try again")
        console.error("Error:", error);
    } finally {
        setSubmitted(false)
      
    }

    return null;
}
