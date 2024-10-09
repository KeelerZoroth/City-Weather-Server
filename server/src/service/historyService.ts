import fs from "fs"

// TODO: Define a City class with name and id properties
class City {
  name: string;
  id: string;
  constructor(name: string, id: string){
    this.name = name;
    this.id = id;
  }  
}

// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file

  private async read() {
    return fs.readFileSync("./db/searchHistory.json", "utf8");
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    const historyDB = await JSON.parse(await this.read());
    for(let city in cities){
      historyDB.push(cities[city]);
    }
    fs.writeFileSync("./db/searchHistory.json", JSON.stringify(historyDB));
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    const historyDB = await JSON.parse(await this.read());
    const citiesList: City[] = [];
    for(let i: number = 0; i < historyDB.length; i++){
      citiesList.push(new City(historyDB[i].name, historyDB[i].id));
    }
    return citiesList;
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    this.write([await JSON.parse(city)]);
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    const historyDB = await JSON.parse(await this.read());
    const indexOnDB: number = historyDB.indexOf(historyDB.filter((element: any) => element.id === id)[0]);
    console.log(historyDB);
    historyDB.splice(indexOnDB, 1);
    console.log(historyDB);

    fs.writeFileSync("./db/searchHistory.json", JSON.stringify(historyDB));

    return historyDB
  }
}

export default new HistoryService();
