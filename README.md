# 100035-DowellScale-Function
START							
    call dowellstapel scale()						

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
        Input from Frontend programmer or project owner					

      Define the spacing units as variable "t"						
        Input from Frontend programmer or project owner					

        check if 0<t<=5 and is integer, then continue					
          otherwise prompt " spacing units should be an integer between 1 and 5"				

      Display Staple Scale						
        0-10t/ 0-9t/ 0-8t/...0+9t/ 0+10t					

      Define the score value as a variable "score" 						
        select a value from the displayed scale					
          Input from the end user				

    Function output(score,display,range of scale,spacing units,time duration,time,colour,colour code,direction)						

END							
