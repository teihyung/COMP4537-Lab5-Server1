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
                document.getElementById("resultVal").innerHTML = insertSuccess + xhttp.responseText;
            }
        };
    }

    function submitQuery() {
        const query = document.getElementById("queryInput").value.toUpperCase();
        const isSelect = query.startsWith("SELECT");
        const isInsert = query.startsWith("INSERT");
        const method = isSelect ? "GET" : "POST";
        let url = "http://yourserver.com/query";

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
