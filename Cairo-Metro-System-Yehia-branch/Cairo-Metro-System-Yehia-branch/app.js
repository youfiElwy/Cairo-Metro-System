function floydWarshall(adjMatrix) {
    const numVertices = adjMatrix.length;
    const dist = Array.from({ length: numVertices }, () =>
        Array.from({ length: numVertices }, () => Infinity)
    );
    const path = Array.from({ length: numVertices }, () =>
        Array.from({ length: numVertices }, () => null)
    );

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
                        shortestPaths[i][j].push(vp[node]);
                        node = path[i][node];
                    }
                    shortestPaths[i][j].push(vp[i]);
                    numEdges[i][j] = shortestPaths[i][j].length - 1;
                }
            }
        }
    }

    return { shortestPaths, numEdges };
}

// Example usage
    const s1 = new Set(); // names of stations
    const mp = new Map();
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
        "New El-Marg",
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
        "El Monib",
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
    let z = 0;
    for (let i of stations) {
        if (!s1.has(i)) {
            mp.set(i, z++);
            s1.add(i);
        }
    }
    const adjMatrix = new Array(s1.size);
    for (let i = 0; i < adjMatrix.length; i++) {
        adjMatrix[i] = new Array(s1.size).fill(false);
    }
    for (let i = 1; i < 78; i++) {
        if (i !== 35 && i !== 55) {
            adjMatrix[mp.get(stations[i])][mp.get(stations[i - 1])] = true;
            adjMatrix[mp.get(stations[i - 1])][mp.get(stations[i])] = true;
        }
    }
    const vp = [];
    for (let [key, value] of mp) {
        vp.push([value, key]);
    }
    vp.sort((a,b)=>a[0]-b[0]);


const { dist, path } = floydWarshall(adjMatrix);
const { shortestPaths, numEdges } = getShortestPaths(dist, path);

// Print shortest distances between all pairs of vertices
let cost;
for (let i = 0; i < adjMatrix.length; i++) {
    for (let j = 0; j < adjMatrix.length; j++) {
        if (i !== j) {
        //console.log(`Shortest path from ${vp[i]} to ${vp[j]}: ${shortestPaths[i][j]}`);
        // console.log(`Number of edges in the path: ${numEdges[i][j]}`);
         
            if(numEdges[i][j]<=9)cost=5;
            else if(numEdges[i][j]<=16)cost=7;
            else cost=10;
            console.log(`The cost of the trip: ${cost}`);
        }
    }
}
