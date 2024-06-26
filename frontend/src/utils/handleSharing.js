export default async function handleSharing(formData,setButtonLinks,setButtonLinksGenerated) {
    try {
        let { channels } = formData;
        let channelInstanceList = [];

  
        channels.forEach((channel, channelIndex) => {
            let instancesDetails = [];


            channel.instances.forEach((instance, instanceIndex) => {
                instancesDetails.push({
                    instance_name: `instances_${instanceIndex + 1}`,
                    instance_display_name: instance
                });
            });

            channelInstanceList.push({
                channel_name: `channel_${channelIndex + 1}`,
                channel_display_name: channel.channelName,
                instances_details: instancesDetails
            });
        });
        console.log(channelInstanceList)
    
        let requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "workspace_id": "653637a4950d738c6249aa9a",
                "username": "CustomerSupport",
                "scale_name": formData.scaleName,
                "channel_instance_list":channelInstanceList,
                "scale_type": "nps_lite",
                "user_type": true,
                "no_of_responses":100000
            }
            )
        };


        const response = await fetch(
            "https://100035.pythonanywhere.com/addons/create-scale/v3/",
            requestOptions
        );
        const data = await response.json();

    
        if (data.urls && data.urls.length > 0) {
            const instanceURL = data.urls[0].urls[0].instance_urls;
            setButtonLinks(instanceURL)
            setButtonLinksGenerated(true)
            console.log(instanceURL);
        }
    } catch (error) {
        console.error("Error:", error);
    } finally {
        console.log("finally");
    }

    return null;
}
