if (!String.prototype.format) {
    String.prototype.format = function() {
      var args = arguments;
      return this.replace(/{(\d+)}/g, function(match, number) {
        return typeof args[number] != 'undefined' ? args[number] : match;
      });
    };
}




var data_count = 1;
var data_items_list = [];  // Temporary memory, being used to hold the values and labels
var data_limits_list = [];
var using_colors = false;

const COLORS_LIST = ["#CC99C9","#9EC1CF","#9EE09E","#FDFD97","#FEB144","#FF6663","#E0BBE4","#957DAD","#D291BC","#FEC8D8","#FFDFD3","#C1E3FE","#CFB6E5","#FFD9E0","#F1EECD","#C9DECE","#FDD3BB","#F7E9C5","#D0D9A8","#A5CBAF","#9A91AC","#CAA7BD","#FFB9C4","#FFD3D4"];
const GRAPH_NAME = document.getElementById("input-graph-name");
const DATA_ITEMS = document.getElementById("data-items");


function on_input_change() {
    data_items_list.length = 0; // Reset the list and then fill with the information provided
    for(let i = 1; i <= data_count; i++) {
        try { // Use try catch block not to stop the program
            var _label = document.getElementById("input-item-" + i + "-label").value; // Get label value
            var _value = document.getElementById("input-item-" + i + "-value").value; // Get value value
        } catch {
            console.log(".");
        }

        data_items_list.push({ // Add this item ("input-item-" + i + "-label") to memory
            label: _label,
            value: _value,
            order: i // 1,2,3,4,5,6,7,..
        });
    }
    create_graphs();
}


function onLoad() { // Runs when page loads. Creates first item
    data_items_list.length = 0;
    data_items_list.push({ // Adds first item to memory
        label: "",
        value: 0,
        order: data_count
    });

    DATA_ITEMS.innerHTML = ('\
            <div id="data-item-{0}" class="data-item">\
                <input onchange="on_input_change()" class="data-input-label inputjs" id="input-item-{0}-label" type="text" placeholder="Data Label">\
                =\
                <input onchange="on_input_change()" class="data-input-value inputjs" id="input-item-{0}-value" type="number" placeholder="Value" min="0" value="0">\
                <div id="data-item-{0}-buttons" class="data-item-buttons">\
                    <button id="data-item-{0}-btn-up" class="btn btn-item btn-up-item btn-unactive"><i class="fas fa-chevron-up"></i></button>\
                    <button id="data-item-{0}-btn-down" class="btn btn-item btn-down-item btn-unactive"><i class="fas fa-chevron-down"></i></button>\
                    <button id="data-item-{0}-btn-del" class="btn btn-item btn-del-item btn-unactive"><i class="fas fa-trash-alt"></i></button>\
                </div>\
            </div>'.format(data_count));
    create_graphs();
}


function add_data_sec() {
    data_count++;

    data_items_list.push({ // Adds another item to memory
        label: "",
        value: 0,
        order: data_count
    });

    create_data_table(); // Recreates whole section according to items' ["order"]s
    create_graphs();
}




function create_data_table() { // Recreate and fill
    setTimeout(() => { // I don't know why I did this like that
        DATA_ITEMS.innerHTML = "";
    }, 0);

    setTimeout(() => {
        for(let j = 0; j < data_items_list.length; j++) {
            if(data_items_list.length == 1) {
                DATA_ITEMS.innerHTML = ('\
                <div id="data-item-{0}" class="data-item">\
                    <input onchange="on_input_change()" class="data-input-label inputjs" id="input-item-{0}-label" type="text" placeholder="Data Label">\
                    =\
                    <input onchange="on_input_change()" class="data-input-value inputjs" id="input-item-{0}-value" type="number" placeholder="Value" min="0" value="0">\
                    <div id="data-item-{0}-buttons" class="data-item-buttons">\
                        <button id="data-item-{0}-btn-up" class="btn btn-item btn-up-item btn-unactive"><i class="fas fa-chevron-up"></i></button>\
                        <button id="data-item-{0}-btn-down" class="btn btn-item btn-down-item btn-unactive"><i class="fas fa-chevron-down"></i></button>\
                        <button id="data-item-{0}-btn-del" class="btn btn-item btn-del-item btn-unactive"><i class="fas fa-trash-alt"></i></button>\
                    </div>\
                </div>'.format(j+1));
            } else {
                if((j+1) == 1) {
                    DATA_ITEMS.innerHTML += ('\
                    <div id="data-item-{0}" class="data-item">\
                        <input onchange="on_input_change()" class="data-input-label inputjs" id="input-item-{0}-label" type="text" placeholder="Data Label">\
                        =\
                        <input onchange="on_input_change()" class="data-input-value inputjs" id="input-item-{0}-value" type="number" placeholder="Value" min="0" value="0">\
                        <div id="data-item-{0}-buttons" class="data-item-buttons">\
                            <button id="data-item-{0}-btn-up" class="btn btn-item btn-up-item btn-unactive"><i class="fas fa-chevron-up"></i></button>\
                            <button id="data-item-{0}-btn-down" class="btn btn-item btn-down-item" onclick="carry_down({0})"><i class="fas fa-chevron-down"></i></button>\
                            <button id="data-item-{0}-btn-del" class="btn btn-item btn-del-item" onclick="remove_data({0})"><i class="fas fa-trash-alt"></i></button>\
                        </div>\
                    </div>'.format(j+1));
                } else if((j+1) == data_items_list.length) {
                    DATA_ITEMS.innerHTML += ('\
                    <div id="data-item-{0}" class="data-item">\
                        <input onchange="on_input_change()" class="data-input-label inputjs" id="input-item-{0}-label" type="text" placeholder="Data Label">\
                        =\
                        <input onchange="on_input_change()" class="data-input-value inputjs" id="input-item-{0}-value" type="number" placeholder="Value" min="0" value="0">\
                        <div id="data-item-{0}-buttons" class="data-item-buttons">\
                            <button id="data-item-{0}-btn-up" class="btn btn-item btn-up-item" onclick="carry_up({0})"><i class="fas fa-chevron-up"></i></button>\
                            <button id="data-item-{0}-btn-down" class="btn btn-item btn-down-item btn-unactive"><i class="fas fa-chevron-down"></i></button>\
                            <button id="data-item-{0}-btn-del" class="btn btn-item btn-del-item" onclick="remove_data({0})"><i class="fas fa-trash-alt"></i></button>\
                        </div>\
                    </div>'.format(j+1));
                } else {
                    DATA_ITEMS.innerHTML += ('\
                    <div id="data-item-{0}" class="data-item">\
                        <input onchange="on_input_change()" class="data-input-label inputjs" id="input-item-{0}-label" type="text" placeholder="Data Label">\
                        =\
                        <input onchange="on_input_change()" class="data-input-value inputjs" id="input-item-{0}-value" type="number" placeholder="Value" min="0" value="0">\
                        <div id="data-item-{0}-buttons" class="data-item-buttons">\
                            <button id="data-item-{0}-btn-up" class="btn btn-item btn-up-item" onclick="carry_up({0})"><i class="fas fa-chevron-up"></i></button>\
                            <button id="data-item-{0}-btn-down" class="btn btn-item btn-down-item" onclick="carry_down({0})"><i class="fas fa-chevron-down"></i></button>\
                            <button id="data-item-{0}-btn-del" class="btn btn-item btn-del-item" onclick="remove_data({0})"><i class="fas fa-trash-alt"></i></button>\
                        </div>\
                    </div>'.format(j+1)); // Create elements according to order numbers (This will help later to rearrange the sorting)
                }
            }

            setTimeout(() => { // I don't know why...
                assign_items();
            }, 0);

        }
    }, 1); // Same...
}



function assign_items() { // Assign values to items
    for(let l = 0; l < data_items_list.length; l++) {
        var number = parseInt(data_items_list[l]["order"]); // Shortcut
        var element = data_items_list[l];
        document.getElementById("input-item-" + number + "-label").setAttribute('value', element["label"]);
        document.getElementById("input-item-" + number + "-value").setAttribute('value', parseInt(element["value"]));
    }
}

function carry_up(id) {
    var element_clicked = data_items_list.find( ({order}) => order == id );
    var element_affected = data_items_list.find( ({order}) => order == id-1 );

    element_clicked.order = parseInt(id-1);
    element_affected.order = parseInt(id);

    create_data_table();
    setTimeout(() => {
        create_graphs();
    }, 50);
}

function carry_down(id) {
    var element_clicked = data_items_list.find( ({order}) => order == id );
    var element_affected = data_items_list.find( ({order}) => order == id+1 );

    element_clicked.order = parseInt(id+1);
    element_affected.order = parseInt(id);

    create_data_table();
    setTimeout(() => {
        create_graphs();
    }, 50);
}

function remove_data(id) {
    data_count--;
    var element_removed = data_items_list.find( ({order}) => order == id );
    data_items_list.splice(data_items_list.indexOf(element_removed), 1);
    for(let u = id; u <= data_items_list.length; u++) {
        var element_fix_order = data_items_list.find( ({order}) => order == u+1 );
        element_fix_order["order"] = parseInt(element_fix_order.order) - 1;
    }
    create_data_table();
    setTimeout(() => {
        create_graphs();
    }, 50);
}



//////////////// GRAPH ////////////////

const GRAPH_VALUES = document.getElementsByClassName("graph-value");
const GRAPHS_CONTAINER = document.getElementById("graphs-container");
const GRAPH_SEC = document.getElementById("graph-sec");
const GRAPH_COLUMNS = document.getElementsByClassName("graph-column");
const GRAPH_VALUES_CONTAINER = document.getElementById("graph-values");

function fix() {
    for(let t = 0; t < GRAPH_VALUES.length; t++) {
        if(t+1 != GRAPH_VALUES.length) {
            GRAPH_VALUES[t].style.marginBottom = GRAPH_SEC.clientHeight / 15 + "px";
        }
    }
    setTimeout(() => {
        create_graphs();
    }, 50);
}
fix();


var max_value;

function arrange_limits() {
    data_limits_list.length = 0;
    for(let f = 0; f < data_count; f++) {
        data_limits_list.push(parseInt(document.getElementById("input-item-" + (f+1) + "-value").value));
    }

    max_value = Math.ceil(Math.max(...data_limits_list) / 100.0) * 100;

    if(max_value == 0) {
        max_value = 100;
    }

    for(let x = 0; x <= 10; x++) {
        if(x == 0) {
            document.getElementById("graph-value-" + x).innerHTML = 0;
        } else if (x != 10) {
            document.getElementById("graph-value-" + x).innerHTML = (max_value / 10) * x;
        } else {
            document.getElementById("graph-value-" + x).innerHTML = max_value;
        }
    }
}




function create_graphs() {

    arrange_limits();

    GRAPHS_CONTAINER.innerHTML = "";
    for(let v = 1; v <= data_count; v++) {
        GRAPHS_CONTAINER.innerHTML += ('\
            <div class="graph-column" id="graph-{0}">\
            berke\
            </div>'.format(v));
    }

    for(let q = 0; q < GRAPH_COLUMNS.length; q++) {
        if(data_count == 1) {
            GRAPH_COLUMNS[q].style.width = "{0}%".format(20/data_count);
        } else if(data_count == 2) {
            GRAPH_COLUMNS[q].style.width = "{0}%".format(40/data_count);
        } else if(data_count == 3) {
            GRAPH_COLUMNS[q].style.width = "{0}%".format(60/data_count);
        } else {
            GRAPH_COLUMNS[q].style.width = "{0}%".format(80/data_count);
        }

        if(data_count > 15 && data_count < 25) {
            GRAPH_COLUMNS[q].style.fontSize = "15px";
        } else if(data_count >= 25) {
            GRAPH_COLUMNS[q].style.fontSize = "10px";
        }

    }

    for(let w = 1; w <= data_count; w++) {
        var graph_column = document.getElementById("graph-" + w);
        var data_item_label = document.getElementById("input-item-" + w + "-label").value;
        var data_item_value = document.getElementById("input-item-" + w + "-value").value;
        graph_column.innerHTML = data_item_label + " " + data_item_value;

        var temp_value;
        var fix_value;

        if(data_item_value == max_value) {
            temp_value = 98;
        } else {
            fix_value = (100 - ((max_value - data_item_value) / max_value)) / 100;
            temp_value = ((95 * parseInt(data_item_value)) / max_value) + ((fix_value/2) * 5) + 0.9;
        }
        graph_column.style.height = temp_value + "%";
    }

    if(using_colors) {
        use_colors();
    }
}





//////////////// COLOR ////////////////

var selection;

function use_colors() {
    for(let k = 0; k < GRAPH_COLUMNS.length; k++) {
        using_colors = true;
        selection = Math.floor(Math.random() * COLORS_LIST.length);
        GRAPH_COLUMNS[k].style.backgroundColor = COLORS_LIST[selection];
        GRAPH_COLUMNS[k].style.color = "#24252A";
    }
}

function dont_use_colors() {
    for(let n = 0; n < GRAPH_COLUMNS.length; n++) {
        using_colors = false;
        GRAPH_COLUMNS[n].style.backgroundColor = "#359b91";
        GRAPH_COLUMNS[n].style.color = "#E0E4EE";
    }
}



function remove_info_box() {
    document.getElementById("usage").remove();
}

function display_info_box() {
    document.getElementById("usage-container").innerHTML += '\
        <div id="usage">\
                <div id="usage-box">\
                    <h1>GRAPH GENERATOR USAGE</h1>\
                    <div class="usage-box-item">\
                        <img src="images/add_data.png" alt="add_data.png">\
                        <p>Add Data button is used to add data</p>\
                    </div>\
                    <div class="usage-box-item" dir="rtl">\
                        <img src="images/colors.png" alt="add_data.png">\
                        <p>Colors of graphs can be changed by using these buttons</p>\
                    </div>\
                    <div class="usage-box-item">\
                        <img src="images/buttons.png" alt="add_data.png">\
                        <p>Data items can be moved up and down by using arrows<br>They can be deleted by using trash</p>\
                    </div>\
                    <div class="usage-box-item" dir="rtl">\
                        <img src="images/nav.png" alt="add_data.png">\
                        <p>All this information can be displayed by clicking "How"<br>You can also see the source code for this project by clicking "Code"</p>\
                    </div>\
                    <button id="remove-info-box-btn" onclick="remove_info_box()">OK</button>\
                </div>\
            </div>';
}




































