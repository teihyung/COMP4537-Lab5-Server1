/**
 * Class for managing HTTP requests
 */
class HttpRequestManager {
    constructor() {
        this.baseUrl = "https://comp-4537-lab5-server2.vercel.app";
    }

    sendRequest(method, url, headers, data, callback) {
        const xhttp = new XMLHttpRequest();
        xhttp.open(method, this.baseUrl + url, true);

        // Set headers
        if (headers) {
            for (const [key, value] of Object.entries(headers)) {
                xhttp.setRequestHeader(key, value);
            }
        }

        // Set data and send request
        xhttp.send(data);

        // Handle response
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState === 4) {
                callback(xhttp.status, xhttp.responseText);
            }
        };
    }
}

/**
 * Class for managing database access
 */
class DBAccessManager {
    constructor(httpRequestManager) {
        this.httpRequestManager = httpRequestManager;
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

        const dataWithIds = data.map((patient, index) => ({ patientid: index + 1, ...patient }));
        const requestData = JSON.stringify({ data: dataWithIds });

        const headers = { "Content-Type": "application/json" };

        this.httpRequestManager.sendRequest("POST", "/insert", headers, requestData, (status, responseText) => {
            if (status === 200) {
                document.getElementById("resultVal").innerHTML = responseText;
            }
        });
    }

    submitQuery() {
        const query = document.getElementById("queryInput").value.toUpperCase();
        const isSelect = query.startsWith("SELECT");
        const isInsert = query.startsWith("INSERT");
        const method = isSelect ? "GET" : "POST";
        let url = "/query";

        if (isSelect) {
            url += "?query=" + encodeURIComponent(query);
            this.httpRequestManager.sendRequest(method, url, null, null, (status, responseText) => {
                if (status === 200) {
                    document.getElementById("resultVal").innerHTML = responseText;
                }
            });
        } else {
            const headers = isInsert ? { "Content-Type": "application/json" } : { "Content-Type": "application/x-www-form-urlencoded" };
            const requestData = isInsert ? JSON.stringify({ query: query }) : "query=" + encodeURIComponent(query);

            this.httpRequestManager.sendRequest(method, url, headers, requestData, (status, responseText) => {
                if (status === 200) {
                    document.getElementById("resultVal").innerHTML = responseText;
                }
            });
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const httpRequestManager = new HttpRequestManager();
    new DBAccessManager(httpRequestManager);
});