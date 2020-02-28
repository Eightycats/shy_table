// Demo of ShyTable. Adds a millions rows. Loads and scrolls smoothly.
var table = new ShyTable('#parent', (data, index) => {
    var row = $('<div class="row ' + ((index % 2 == 0) ? 'lightRow' : 'darkRow') + '"></div>');
    var one = $('<div class="cell one"></div>');
    one.text(index);
    var two = $('<div class="cell two"></div>');
    two.text('abcdefghijklmnopabcdefghijklmnopabcdefghijklmnop');
    var three = $('<div class="cell three"></div>');
    three.text(data.name);

    row.append(one);
    row.append(two);
    row.append(three);
    return row;
});

var data = [];
for (var i = 0; i < 1000000; i++) {
    data.push({name: 'Test ' + i});
}
table.setData(data);
