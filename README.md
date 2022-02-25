# 100035-DowellScale-Function
start								
    call dowellnps scale function()							

      Check the direction of the scale,which is required?							
        Display a list and ask  Frontend programmer or project owner to select one from the list						
          Horizontal					
          Vertical					

      Check if Colour is required or not							
        if yes,						
          Display a list of Colour HEX code					
            Frontend programmer or project owner can select one from the list				

      Check if time for getting an answer for each question is required,							
        Yes/No						
          Input from Frontend programmer or project owner					

      Define the range of scale as variable (a,b)							
        Input from Frontend programmer or project owner				Note: range of the scale should be (0,10)		

        Check if the a=0 & b=10, then continue						
          if not, prompt "The range should be strictly between 0 to 10					

        Assign suitable labels to the upper and lower limits of the range						
          Input from the front-end programmer or project owner					
          0=Won't recommend/ picture label, 10=Highly recommend/ picture label					

       Define the spacing units as variable t					Note: spacing should be 1 unit		
        Input from Frontend programmer or project owner						

        check if t=1, then continue						
          otherwise prompt "spacing units should be 1"					

       Display NPS Scale							
       0/1/2/3/4/5/6/7/8/9/10						
        labels						

      Define the score value as a variable "score" 							
        select a value from the displayed scale						
          Input from the end user					

      Define a variable "category"							
        category shall be assigned to each response based on the value of "score" variable						



    Function output (score,category,display,range of scale,labels,spacing units,colour,colour code,direction)							

  end								
