function floydWarshall(adjMatrix) {
  const numVertices = adjMatrix.length;
  // intialize the 2d result array (dist) with OO
  const dist = Array.from({ length: numVertices }, () =>
    Array.from({ length: numVertices }, () => Infinity)
  );
  // intialize the 2d pathes array (path) with null
  const path = Array.from({ length: numVertices }, () =>
    Array.from({ length: numVertices }, () => null)
  );
  // here if there is edge between i & j set the distance = 1  and initialize the path with i

  for (let i = 0; i < numVertices; i++) {
    for (let j = 0; j < numVertices; j++) {
      if (i === j) {
        dist[i][j] = 0;
        path[i][j] = i;
      } else if (adjMatrix[i][j]) {
        dist[i][j] = 1;
        path[i][j] = i;
      }
    }
  }
  // floyd warshall algo implementation
  for (let k = 0; k < numVertices; k++) {
    for (let i = 0; i < numVertices; i++) {
      for (let j = 0; j < numVertices; j++) {
        if (dist[i][j] > dist[i][k] + dist[k][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
          path[i][j] = path[k][j];
        }
      }
    }
  }

  return { dist, path };
}

function getShortestPaths(dist, path) {
  const numVertices = dist.length;
  const shortestPaths = Array.from({ length: numVertices }, () =>
    Array.from({ length: numVertices }, () => [])
  );
  const numEdges = Array.from({ length: numVertices }, () =>
    Array.from({ length: numVertices }, () => 0)
  );

  for (let i = 0; i < numVertices; i++) {
    for (let j = 0; j < numVertices; j++) {
      if (i !== j) {
        if (path[i][j] === null) {
          shortestPaths[i][j] = null;
          numEdges[i][j] = Infinity;
        } else {
          let node = j;
          while (node !== i) {
            shortestPaths[i][j].push(vp[node][1]);
            node = path[i][node];
          }
          shortestPaths[i][j].push(vp[i][1]);
          shortestPaths[i][j].reverse();
          numEdges[i][j] = shortestPaths[i][j].length - 1;
        }
      }
    }
  }

  return { shortestPaths, numEdges };
}

// Example usage
const s1 = new Set(); // names of stations
const mp = new Map(); // to map each station for an id
const stations = [
  "Helwan",
  "Ain Helwan",
  "Helwan University",
  "Wadi Hof",
  "Hadayek Helwan",
  "El-Maasara",
  "Tora El-Asmant",
  "Kozzika",
  "Tora El-Balad",
  "Sakanat El-Maadi",
  "Maadi",
  "Hadayek El-Maadi",
  "Dar El-Salam",
  "El-Zahraa'",
  "Mar Girgis",
  "El-Malek El-Saleh",
  "Al-Sayeda Zeinab",
  "Saad Zaghloul",
  "Sadat",
  "Nasser",
  "Orabi",
  "Al-Shohadaa",
  "Ghamra",
  "El-Demerdash",
  "Manshiet El-Sadr",
  "Kobri El-Qobba",
  "Hammamat El-Qobba",
  "Saray El-Qobba",
  "Hadayeq El-Zaitoun",
  "Helmeyet El-Zaitoun",
  "El-Matareyya",
  "Ain Shams",
  "Ezbet El-Nakhl",
  "El-Marg",
  "New El-Marg", //end of the first line
  "Shubra",
  "Koleyet El Zeraa",
  "El Mazallat",
  "El Khalafawi",
  "St. Teresa",
  "Rod El Farag",
  "Massara",
  "Al-Shohadaa",
  "Attaba",
  "M. Naguib",
  "Sadat",
  "Ópera",
  "Dokki",
  "El Bohoos",
  "Cairo University",
  "Faisal",
  "Guiza",
  "Omm el Misryeen",
  "Sakiat Mekki",
  "El Monib", //end of the second line
  "Adly Mansour",
  "El Haykestep",
  "Omar Ibn El-Khattab",
  "Qobaa",
  "Hesham Barakat",
  "El-Nozha",
  "Nadi El-Shams",
  "Alf Maskan",
  "Heliopolis Square",
  "Haroun",
  "Al-Ahram",
  "Koleyet El-Banat",
  "Stadium",
  "Fair Zone",
  "Abbassia",
  "Abdou Pasha",
  "El Geish",
  "Bab El Shaaria",
  "Attaba",
  "Nasser",
  "Maspero",
  "Safaa Hegazy",
  "Kit Kat",
];

let first_line_end = stations.indexOf("New El-Marg"); // ⚠⚠⚠ note must be changed if we add a station
//console.log(first_line_end);
let second_line_end = stations.indexOf("El Monib");
//console.log(second_line_end);

let z = 0;
// mapping the stations to unique id
for (let i of stations) {
  if (!s1.has(i)) {
    mp.set(i, z++);
    s1.add(i);
  }
}

// intialize 2d matrix with diemnsion= unique stations*unique stations size with false
const adjMatrix = new Array(s1.size);
for (let i = 0; i < adjMatrix.length; i++) {
  adjMatrix[i] = new Array(s1.size).fill(false);
}
// here we are intializing the maatrix (putting the edges)
for (let i = 1; i < stations.length; i++) {
  if (i !== first_line_end + 1 && i !== second_line_end + 1) {
    //if  i isn't the last station in the 1st or the 2nd line so make edge  we did this to prevent the last station in the 1st be connected to the first station in the 2nd line
    adjMatrix[mp.get(stations[i])][mp.get(stations[i - 1])] = true;
    adjMatrix[mp.get(stations[i - 1])][mp.get(stations[i])] = true;
  }
}
// console.log(adjMatrix);

const vp = []; //this vp you give it the id it returns the station name  nad it's sorted according to the id
for (let [key, value] of mp) {
  vp.push([value, key]);
}
vp.sort((a, b) => a[0] - b[0]);

const { dist, path } = floydWarshall(adjMatrix);
let { shortestPaths, numEdges } = getShortestPaths(dist, path);
// the final result in  shortestPaths for path and numEdges for number of stations
module.exports = {
  floydWarshall,
  getShortestPaths,
  s1,
  numEdges,
  shortestPaths,
  mp,
  vp,
  stations,
  mp,
};
// Print shortest distances between all pairs of vertices

// let cost;
// for (let i = 0; i < adjMatrix.length; i++) {
//     for (let j = 0; j < adjMatrix.length; j++) {
//         if (i !== j) {
//         //console.log(`Shortest path from ${vp[i]} to ${vp[j]}: ${shortestPaths[i][j]}`);
//         // console.log(`Number of edges in the path: ${numEdges[i][j]}`);

//             if(numEdges[i][j]<=9)cost=5;
//             else if(numEdges[i][j]<=16)cost=7;
//             else cost=10;
//             console.log(`The cost of the trip: ${cost}`);
//         }
//     }
// }

// console.log(numEdges[mp.get("Al-Shohadaa")][mp.get("Nasser")]);
// console.log(shortestPaths[mp.get("Al-Shohadaa")][mp.get("Nasser")]);
