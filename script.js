document.getElementById("startbutton").addEventListener("click", function() {
    fetch("https://sandbox.belvo.com/api/token/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: "e385356c-46bf-4e5f-b790-c9a5a37e5ed2",
            password: "03xT8Ym_QstKjPwWjSua0xaSDmBSi-CUoKtr1P9sSTx4d5@8*gO8VOMdICu74aq4",
            scopes: "read_institutions,write_links",
            fetch_resources: ["ACCOUNTS","TRANSACTIONS","OWNERS"]
        })
    })
    .then(response => response.json())
    .then(data => {
        const accessToken = data.access;

        function successCallbackFunction(link, institution) {
            console.log(link);
            localStorage.setItem("link", link);
        }

        belvoSDK.createWidget(accessToken,{
            locale: "en",
            access_mode: "single",
            country_codes: ["CO"],
            //institution_types: ["retail", "business","fiscal","employment"],
            //resources: ["ACCOUNTS", "OWNERS", "TRANSACTIONS"],
            callback: (link, institution) => successCallbackFunction(link, institution),
        }).build();

        this.disabled = true;
        document.getElementById("overlay").style.display = "none";
    })
    .catch(error => console.error("Error with the widget", error));
});



document.getElementById("trxbutton").addEventListener("click", function() {
    currentLink= localStorage.getItem("link");

    fetch("https://sandbox.belvo.com/api/transactions/?page=1&link="+currentLink, {
                method: "GET",
                headers: {Authorization: "Basic ZTM4NTM1NmMtNDZiZi00ZTVmLWI3OTAtYzlhNWEzN2U1ZWQyOjAzeFQ4WW1fUXN0S2pQd1dqU3VhMHhhU0RtQlNpLUNVb0t0cjFQOXNTVHg0ZDVAOCpnTzhWT01kSUN1NzRhcTQ="}
              })
                .then(response => response.json())
                .then(trxs => {
                    if(trxs.count!=0){
                        this.disabled = true;
                        this.style.display = "none";
                        //document.querySelector("#item").style.filter = "blur(1px)";

                        document.getElementById("linkid").innerHTML="link id: "+currentLink;
                        const transactionsTable = document.querySelector("#transactionsTable tbody");
                        transactionsTable.innerHTML = ""; // Limpiar la tabla antes de añadir nuevas filas

                        for (let i = 0; i < trxs.results.length; i++) {
                            let transaction = trxs.results[i];
                            const row = document.createElement("tr");
                            row.innerHTML = `
                                <td>${transaction.account.name}</td>
                                <td>${transaction.amount}</td>
                                <td>${transaction.currency}</td>
                            `;
                            transactionsTable.appendChild(row);
                        }
                    }    
                    
                    
                    fetch("https://sandbox.belvo.com/api/owners/?page=1&link="+currentLink, {
                    method: "GET",
                    headers: {Authorization: "Basic ZTM4NTM1NmMtNDZiZi00ZTVmLWI3OTAtYzlhNWEzN2U1ZWQyOjAzeFQ4WW1fUXN0S2pQd1dqU3VhMHhhU0RtQlNpLUNVb0t0cjFQOXNTVHg0ZDVAOCpnTzhWT01kSUN1NzRhcTQ="}
                })
                    .then(response => response.json())
                    .then(user => {
                        if(user.count!=0){
                            document.getElementById("owneraccount").innerHTML = user.results[0].first_name+" "+user.results[0].last_name;
                            document.getElementById("owneraccountdetails").innerHTML = user.results[0].document_id.document_type +" "+user.results[0].document_id.document_number+", "+user.results[0].email;
                        }

                        fetch("https://sandbox.belvo.com/api/accounts/?page=1&link="+currentLink, {
                        method: "GET",
                        headers: {Authorization: "Basic ZTM4NTM1NmMtNDZiZi00ZTVmLWI3OTAtYzlhNWEzN2U1ZWQyOjAzeFQ4WW1fUXN0S2pQd1dqU3VhMHhhU0RtQlNpLUNVb0t0cjFQOXNTVHg0ZDVAOCpnTzhWT01kSUN1NzRhcTQ="}
                    })
                        .then(response => response.json())
                        .then(account => {
                            if(account.count!=0){
                                const transactionsTable = document.querySelector("#accountsTable tbody");
                                transactionsTable.innerHTML = ""; // Limpiar la tabla antes de añadir nuevas filas

                                for (let i = 0; i < account.results.length; i++) {
                                    let accountsinfo = account.results[i];
                                    const row = document.createElement("tr");
                                    row.innerHTML = `
                                        <td>${accountsinfo.name}</td>
                                    `;
                                    transactionsTable.appendChild(row);
                                }
                            }
                    }).catch(error => console.error("Error...", error));
                }).catch(error => console.error("Error...", error));
            }).catch(error => console.error("Error...", error));
});