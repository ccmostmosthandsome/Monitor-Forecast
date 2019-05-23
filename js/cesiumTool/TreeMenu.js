(function () {
    window.treeMenu = {
        init: function () {
            var o = {
                showcheck: true

                //onnodeclick:function(item){alert(item.text);},

            };

            o.data = treedata;

            $("#imageTree").treeview(o);

            $("#showchecked").click(function (e) {

                var s = $("#imageTree").getCheckedNodes();

                if (s != null)

                    alert(s.join(","));

                else

                    alert("NULL");

            });

            $("#showcurrent").click(function (e) {

                var s = $("#imageTree").getCurrentNode();

                if (s != null)

                    alert(s.text);

                else

                    alert("NULL");

            });
        }
    }
})();