// For comparison, this example tries to add a million rows when normal.html is opened.
// Browser hangs until this loop is done.
for (var i = 0; i < 1000000; i++) {
    var row = $('<div class="row"></div>');
    var one = $('<div class="cell one"></div>');
    one.text(i);
    var two = $('<div class="cell two"></div>');
    two.text('abcdefghijklmnopabcdefghijklmnopabcdefghijklmnop');
    var three = $('<div class="cell three"></div>');
    three.text('Row: ' + i);

    row.append(one);
    row.append(two);
    row.append(three);

    $('#shyContainer').append(row);
}
