# Food Programs in Peel Region: Web Map for Nucleus Independent Living 
 
<p> This web map was created by Caroline Nee, Muhammad Khalis bin Samion and Polina Gorn for Nucleus Independent Living as part of the Sandbox Initiative that was introduced in GGR472H1: Developing Web Maps. The purpose of the map is to explore food deserts in the Peel region (Mississauga + Brampton + Caledon), based on the day of the week, time of the day, mode of transit, and type of program of interest. This map illustrates that there are many factors that can create food deserts, even if the food programs exist in the area.</p>
<p>The web map was created using the following data sources:

1. **Location of Food Programmes in Peel Region**  
   [**Peel Data Portal - Food Programmes Layer**](https://data.peelregion.ca/datasets/857c09ef7fbb41e18fc9c119aee8ee38_0/explore?location=43.713594%2C-79.809875%2C10.82)

2. **Road Network Data**  
   Sourced from OpenStreetMap in Protocol Buffer Binary Format (PBF) for the Peel Region area:  
   [**BBBike Extract Service**](https://extract.bbbike.org/)

3. **Public Transit Data (GTFS)**  
   General Transit Feed Specification (GTFS) datasets for transit services operating within Peel Region:
   - [**GO Transit**](https://www.metrolinx.com/en/about-us/open-data)
   - [**MiWay**](https://www.mississauga.ca/miway-transit/developer-download/)
   - [**Brampton Transit**](https://geohub.brampton.ca/datasets/a355aabd5a8c490186bdce559c9c75fb/about)</p>

<p>R5py was used to create a network analysis which was then pushed to the web map as a series of hexgrid maps, showing food services accessibility based on the mode of transit (walking or taking the public transit).</p>

## Web Map Interactivity:
To use the web map, the user needs to:
1. Select the day of the week of interest
2. Select the time of the day of interest (Morning/Afternoon/Evening)
3. Select the program type (Food bank/Soup kitchen/All, etc.)
<p>After completing the three steps, the user will be presented with a map of filtered locations that meet the combination of three criteria. After that the user can click on any location to read the location profile and to choose the network analysis of interest (Walking or Public Transit).</p>
