import java.*; 
import java.io.*;
import java.util.Scanner;

public class edgesScript{

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
		//Read file and set filename for ouptut (answer)
        File csv = new File("routes-and-stops-DATA.csv");
        File answer = new File("edgelist-with-name.csv");
		
		String currentStop = "";
		String currentRoute = "";
		
		int count = 0;

    
        try{
            FileInputStream ff = new FileInputStream(csv);
            FileWriter writer = new FileWriter(answer);
			
            Scanner s = new Scanner(ff);
            //If two lines following each have the same route id, they are connected.
			//Write the route id and then the two stops from both lines.
            while(s.hasNextLine()){
                String currentline = s.nextLine();
				String[] currentParts = currentline.split(",");
				
				while(s.hasNextLine()){
					String nextline = s.nextLine();
					String[] nextParts = nextline.split(",");
					
					if(currentParts[0].equalsIgnoreCase(nextParts[0])){
						if(count>0)
							writer.write("\n");
						writer.write(currentParts[0]+ "," + currentParts[1]+ "," + nextParts[1]);
					}
						
					
					count++;
					
					currentline = nextline;
					currentParts = currentline.split(",");
				}
				                
            }
            
            writer.flush();
            writer.close();
            
        }catch(Exception e){
            System.out.println(e.toString());
        }
    }

}