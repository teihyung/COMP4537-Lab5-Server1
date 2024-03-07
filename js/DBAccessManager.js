class DBAccessManager {
    constructor() {
        this.attachEventListeners();
    }

    attachEventListeners() {
        const insertBtn = document.getElementById("insertBtn");
        const queryBtn = document.getElementById("queryBtn");

        if (insertBtn) {
            insertBtn.addEventListener("click", () => this.insertRows());
        }

        if (queryBtn) {
            queryBtn.addEventListener("click", () => this.submitQuery());
        }
    }

    insertRows() {
        const data = [
            { name: 'Sara Brown', dateOfBirth: '1901-01-01' },
            { name: 'John Smith', dateOfBirth: '1941-01-01' },
            { name: 'Jack Ma', dateOfBirth: '1961-01-30' },
            { name: 'Elon Musk', dateOfBirth: '1999-01-01' }
        ];
        const xhttp = new XMLHttpRequest();
        xhttp.open("POST", "http://localhost:8008/insert", true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        
        // Add a unique identifier for each patient (TEMPORARY CODE)
        const dataWithIds = data.map((patient, index) => ({ patientid: index + 1, ...patient }));
    
        xhttp.send(JSON.stringify({ data: dataWithIds }));
    
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState === 4 && xhttp.status === 200) {
                // Set the response directly to the resultVal element
                document.getElementById("resultVal").innerHTML = xhttp.responseText;
            }
        };
    }    

    submitQuery() {
        const query = document.getElementById("queryInput").value.toUpperCase();
        const isSelect = query.startsWith("SELECT");
        const isInsert = query.startsWith("INSERT");
        const method = isSelect ? "GET" : "POST";
        let url = "http://localhost:8008/query";

        const xhttp = new XMLHttpRequest();

        if (isSelect) {
            url += "?query=" + encodeURIComponent(query);
            xhttp.open(method, url, true);
            xhttp.send();
        } else {
            xhttp.open(method, url, true);
            if (isInsert) {
                xhttp.setRequestHeader("Content-Type", "application/json");
                const data = JSON.stringify({ query: query });
                xhttp.send(data);
            } else {
                xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xhttp.send("query=" + encodeURIComponent(query));
            }
        }

        xhttp.onreadystatechange = () => {
            if (xhttp.readyState === 4 && xhttp.status === 200) {
                document.getElementById("resultVal").innerHTML = xhttp.responseText;
            }
        };
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new DBAccessManager();
});