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
            {name: 'Sara Brown', dob: '1901-01-01'},
            {name: 'John Smith', dob: '1941-01-01'},
            {name: 'Jack Ma', dob: '1961-01-30'},
            {name: 'Elon Musk', dob: '1999-01-01'}
        ];
        const xhttp = new XMLHttpRequest();
        xhttp.open("POST", "http://localhost/insert", true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify({data: data}));

        xhttp.onreadystatechange = () => {
            if (xhttp.readyState === 4 && xhttp.status === 200) {
                document.getElementById("resultVal").innerHTML = "Inserted rows successfully: " + xhttp.responseText;
            }
        };
    }

    submitQuery() {
        const query = document.getElementById("queryInput").value.toUpperCase();
        const isSelect = query.startsWith("SELECT");
        const method = isSelect ? "GET" : "POST";
        const url = "http://yourserver.com/query";

        const xhttp = new XMLHttpRequest();
        xhttp.open(method, url, true);

        if (!isSelect) {
            xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhttp.send("query=" + encodeURIComponent(query));
        } else {
            xhttp.send();
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
