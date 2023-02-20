//Author Andrew Abbeyquaye

import java.*; 
import java.io.*;
import java.util.Scanner;

public class stopAndInOutRoutes{
	//Boolean function for checking if string is a number
    public static boolean isNumeric(String str){  
      try{  
        double d = Double.parseDouble(str);  
      }  
      catch(Exception e)  
      {  
        return false;  
      }  
      return true;  
    }
    
    
    
    public static void main(String[] args){
		//Read file and set filenames for ouptut (incomingRoutes and outgoingRoutes)
        File inputFile = new File("route-and-their-stops.csv");
        File incomingRoutes = new File("incoming-routes.csv");
		File outgoingRoutes = new File("outgoing-routes.csv");
		

		
		int count = 0;

    
        try{
            FileInputStream ff = new FileInputStream(inputFile);
            FileWriter inWriter = new FileWriter(incomingRoutes);
			FileWriter outWriter = new FileWriter(outgoingRoutes);
			
            Scanner s = new Scanner(ff);
            
            while(s.hasNextLine()){
                String currentline = s.nextLine();
				String[] currentParts = currentline.split(",");
				
				//Create route and stop pairs for each line in the input file such that
				//the start stop on the route gets only an outgoing route, end point an incoming route only
				//and intermediary stops both incoming and outgoing
				for(int i = 1; i < currentParts.length; i++){
					
					if(i > 1)
						inWriter.write(currentParts[i]+ "," + currentParts[0] + "\n");
					
					if(i < currentParts.length - 1)
						outWriter.write(currentParts[i]+ "," + currentParts[0] + "\n");
				}
				
				                
            }
            
            inWriter.flush();
            inWriter.close();
			outWriter.flush();
            outWriter.close();
            
        }catch(Exception e){
            System.out.println(e.toString());
        }
    }

}