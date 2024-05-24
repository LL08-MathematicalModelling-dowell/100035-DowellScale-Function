export default function emailCode(buttonLinks,ratings,formData){
  if(ratings[0]=="Bad"){
return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Feedback</title>
</head>
<body style="font-family: sans-serif;">
  <p style="text-align: center; font-weight: 500; padding: 10px;">How was your experience using our product? Please rate your experience below.</p>
  
  <div style="text-align: center; margin-top: 20px;">
    <a href=${buttonLinks[0]} style="background-color: #ff4a4a; border-radius: 4px; padding: 10px 20px; color: #fff; text-decoration: none; margin-right: 10px;">Bad 😞</a>
    <a href=${buttonLinks[1]} style="background-color: #f3dd1f; border-radius: 4px; padding: 10px 20px; color: #000; text-decoration: none; margin-right: 10px;">Average 😐</a>
    <a href=${buttonLinks[2]} style="background-color: #129561; border-radius: 4px; padding: 10px 20px; color: #fff; text-decoration: none;">Excellent 😄</a>
  </div>
  <p>Edit here..</p>
</body>
</html>
`
  }
  else if(typeof ratings[0]!="number"){
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Feedback</title>
    </head>
    <body style="font-family: sans-serif;">
      <p style="text-align: center; font-weight: 500; padding: 10px;">How was your experience using our product? Please rate your experience below.</p>
      <div style="display: flex; justify-content: center; align-items: center">
      <div style="display: flex; flex-direction: column; width: max-content;">
        <div style="display: flex; flex-direction: ${formData.orientation == 'Vertical' ? 'column' : 'row'}; gap: ${formData.orientation == 'Vertical' ? '5px' : '1px'}; padding: 8px 16px; border: 2px solid #bfbfbf; width: max-content; justify-content: center; align-items: center; gap: ${formData.orientation == 'Vertical' ? '5px' : '3px'}; background-color: ${formData.scaleBackGroundColor};">
          ${ratings.map((score, index) => `
          <button
            onclick="window.location.href = '${buttonLinks[index]}';"
            style="
              border-radius: 4px;
              padding: 8px 4px;
              cursor: pointer;
              font-size: ${window.innerWidth >= 500 ? `${Number(formData.fontSize)}px` : '12px'};
              background-color: ${formData.scaleColor};
              font-family: ${formData.fontStyle};
              color: ${formData.fontColor};
            "
          >
            ${score}
          </button>
          `).join('')}
        </div>
      </div>
      </div>
      <p>Edit here..</p>
    </body>
    </html>
    
    `
  }else{
    return`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Feedback</title>
    </head>
    <body style="font-family: sans-serif;">
      <p style="text-align: center; font-weight: 500; padding: 10px;">How was your experience using our product? Please rate your experience below.</p>
      <div style="display: flex; justify-content: center; align-items: center">
      <div style="display: flex; flex-direction: column; width: max-content;">
  <div style="display: flex; justify-content: center; align-items: center; gap: 3px; background-color: white; padding: 8px 16px; border: 2px solid #bfbfbf; width: max-content;">
    ${ratings.map((score, index) => `
    <button
      onclick="window.location.href = '${buttonLinks[index]}'; setLoading(${index});"
      style="
        font-size: 14px;
        padding: 4px 12px;
        border-radius: 4px;
        cursor: pointer;
        background-color: #00a3ff;
        color: white;
      " 
    >
      ${score}
      
    </button>
    `).join('')}
  </div>
  <div style="width: 100%; display: flex; padding: 8px; justify-content: space-between; align-items: center; font-size: 14px;">
    <p>Bad</p>
    <p>Average</p>
    <p>Excellent</p>
  </div>
</div>
</div>

<p>Edit here..</p>
    </body>
    </html>
    `
  }
}