document.addEventListener("DOMContentLoaded", function () {

    function getById(id) {
        return document.getElementById(id);
    };

    function arrayFromClass(className) {
        return Array.from(document.getElementsByClassName(className));
    };

    let importButton = getById("importButton");

    importButton.disabled = true;

    getById("userInitialsSelect").addEventListener("click", function () {
        let textAreaNotEmpty = (getById("textArea").value !== "");
        let initialSelected = (getById("defaultOption").selected === false);
        let readyToRunFunction = (textAreaNotEmpty && initialSelected);
        if (readyToRunFunction) {
            importButton.disabled = false;
        }
    });

    importButton.addEventListener("click", function () {
        let textAreaContent = getById("textArea").value.trim();
        let stringifiedContent = JSON.stringify(textAreaContent);
        let fixedString;

        let initialSelect = getById("userInitialsSelect");
        let selectedOption = initialSelect[initialSelect.selectedIndex].value;

        function checkStringForStrayQuotes(string) {
            let firstCharOfString = string.charAt(0);
            let lastCharacter = string.length - 1;
            let lastCharOfString = string.charAt(lastCharacter);
            let strayQuote = "\"";
            if (firstCharOfString === strayQuote) {
                string = string.slice(1);
            }
            if (lastCharOfString === strayQuote) {
                string = string.slice(0, -1);
            }
            fixedString = string;
        }
        checkStringForStrayQuotes(stringifiedContent);

        let array1 = fixedString.split("\\n");
        // GET RID OF FIRST LINE
        array1 = array1.slice(1);
        let array2 = [];
        array1.forEach(function (item) {
            let subArray = item.split("\\t");
            let newArray = [];
            // USPS TRACKING NUMBER
            newArray.push(subArray[8]);
            // UPS TRACKING NUMBER 
            newArray.push(subArray[5]);
            // SHIPPING NUMBER
            newArray.push(subArray[17]);
            // FIRST NAME
            newArray.push(subArray[27]);
            array2.push(newArray);
        });

        array2.forEach(function (itemOfArray2, index) {

            function reworkNames() {
                let lastIndex = (itemOfArray2.length - 1);
                let lastArrayItem = itemOfArray2[lastIndex];
                let lowerCaseName = lastArrayItem.toLowerCase();
                let firstChar = lowerCaseName.charAt(0);
                let capitalizedFirstChar = firstChar.toUpperCase();
                lastArrayItem = capitalizedFirstChar + lowerCaseName.slice(1);
                itemOfArray2.splice(lastIndex, 1, lastArrayItem);
            }

            reworkNames();

            let parsedDataTable = getById("parsedDataTable");
            let newTableRow = document.createElement("TR");
            newTableRow.id = "tableRow" + index;
            parsedDataTable.appendChild(newTableRow);
            itemOfArray2.forEach(function (subItemOfArray2) {
                let newTD = document.createElement("TD");
                let tdTextNode = document.createTextNode(subItemOfArray2);
                newTD.appendChild(tdTextNode);
                newTableRow.appendChild(newTD);
            });
            newTableRow.addEventListener("click", function () {
                let allTRElements = document.getElementsByTagName("TR");
                let trElementArray = Array.from(allTRElements);
                let emailTextArea = getById("forEmail");
                let orderNumberInput = getById("orderNumber");
                let forNotes = getById("stringForInstructionsNotes");
                let emailSubjectHeader = getById("emailSubjectHeader");
                let copyingInputs = arrayFromClass("copyingInput");
                copyingInputs.forEach(function (item) {
                    item.classList.remove("invert");
                    item.nextElementSibling.classList.remove("visible");
                });
                trElementArray.forEach(function (item) {
                    item.classList.remove("highlighted");
                });
                if (this.id !== "tableHeadingRow") {
                    this.classList.add("highlighted");
                    let postalServiceNumber = this.children[0].innerHTML;
                    let upsNumber = this.children[1].innerHTML;
                    let orderNumber = this.children[2].innerHTML;
                    let name = this.children[3].innerHTML;
                    let forEmailString = "Dear " + name + ", " + "\n\n" +
                        "Thank you for your most recent order with " +
                        "***COMPANY NAME***." +
                        " For shipping on international orders we ship with a" +
                        " service called UPS Mail Innovations, which is a" +
                        " partnership between UPS and international" +
                        " mail carriers. Basically, UPS handles the package" +
                        " here in the states and then when it reaches the" +
                        " destination country it\'s processed by customs and" +
                        " given to your local mail carrier for delivery." +
                        "\n\n" +
                        "Below you will find the two tracking numbers" +
                        " associated with you order. The first will be the" +
                        " UPS number and the second will be your" +
                        " mail carrier service. We realize you may have" +
                        " already received your items, but if you have not" +
                        " please regard below." + "\n\n" +
                        "https://www.ups.com/track (UPS) - " +
                        upsNumber +
                        "\n\n" +
                        "https://tools.usps.com (Mail Carrier) - " +
                        postalServiceNumber +
                        "\n\n" +
                        "Right now, your package is on its way to the" +
                        " UPS Mail Innovations hub to be sorted and" +
                        " shipped off internationally. Once it arrives," +
                        " it will be processed by customs and delivered to you." +
                        " I\'m confident it will clear customs soon" +
                        " and be on its way to you." +
                        "\n\n" +
                        "If you have any further questions in regards to" +
                        " your order, please do not hesitate to" +
                        " contact us directly.";
                    emailTextArea.value = forEmailString;
                    orderNumberInput.value = orderNumber;
                    let currentDate = new Date();
                    // Why have months start from zero, but not days?
                    let currentMonth = (currentDate.getMonth() + 1);
                    let currentDay = currentDate.getDate();
                    let monthAndDay = currentMonth + "/" + currentDay + " ";
                    let messageForNotes = monthAndDay + "MIP Email Sent: " +
                        postalServiceNumber + " -- " + selectedOption;
                    forNotes.value = messageForNotes;
                    copyingInputs.forEach(function (item) {
                        item.addEventListener("click", function () {
                            item.classList.add("invert");
                            item.select();
                            document.execCommand("copy");
                            item.nextElementSibling.classList.add("visible");
                        });
                    });
                }
            });
            parsedDataTable.appendChild(newTableRow);
        });
        getById("textInputDiv").style.display = "none";
        getById("parsedDataDiv").style.display = "block";
        getById("stuffToBeCopied").style.display = "block";
    });
});