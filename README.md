# **表格扩展工具  by zws.**

## **最佳实践**

#### sample1-动态增加行

``` html
<!DOCTYPE html>
<html>

<head>
    <title>sample1-动态增加行</title>
    <script src="https://cdn.bootcss.com/jquery/3.4.0/jquery.min.js"></script>
    <!-- 最新版本的 Bootstrap 核心 CSS 文件 -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css"
        integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
    <!-- 最新的 Bootstrap 核心 JavaScript 文件 -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/js/bootstrap.min.js"
        integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa"
        crossorigin="anonymous"></script>
    <script src="table-ext.js" type="text/javascript"></script>
</head>

<body>
    <div class="content">
        <table id="tableId">
            <thead>
                <tr>
                    <th>姓名</th>
                    <th>性别</th>
                    <th>个人描述</th>
                    <th style="width: 80px;">操作</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
        <div id="operations">
            <button class="save  ">保存</button>
            <button class="load1  ">加载数据1</button>
            <button class="load2  ">加载数据2</button>
            <button class="reset  ">重置</button>
            <button class="noAppend  ">不追加按钮</button>
            <button class="bootstrapTable ">bootstrap 样式</button>
        </div>
    </div>
    <div style="display:none">
        <table id="tableTrTemplate">
            <tbody>
                <tr>
                    <td><input name="name" /></td>
                    <td><select name="sex">
                            <option value="">保密</option>
                            <option value="0">男</option>
                            <option value="1">女</option>
                        </select></td>
                    <td><textarea name="description"></textarea></td>
                </tr>
            </tbody>
        </table>
    </div>
    <script>
        $(function () {
            var selector = '#tableId';
            var init = function (options) {
                $(selector).find('tbody').html('');
                var util = $(selector).tableUtil();
                util.rowHtml = $('#tableTrTemplate tbody').html();
                $.extend(util.options, options);
                util.addRow();
                return util;
            }
            var util = init();
            var bootstrapOption;
            $('div.content')
                .on('click', 'button.save', function () {
                    alert(JSON.stringify(util.rows()));
                }).on('click', 'button.load1', function () {
                    util.addRow({ name: '张三', sex: '1', description: '我是张三，我喜欢唱、跳、rap' });
                }).on('click', 'button.load2', function () {
                    var c = 3;
                    var data = [];
                    for (let index = 0; index < c; index++) {
                        data.push({ id: index, name: `李四${index}`, sex: 0, description: '我是李四，我喜欢篮球、鸡你好美' })
                    }
                    util.addRows(data);
                }).on('click', 'button.reset', function () {
                    util = init();
                }).on('click', 'button.noAppend', function () {
                    util = init({ appendBtn: false })
                }).on('click', 'button.bootstrapTable', function () {
                    let isAdd = bootstrapOption == 'addClass';
                    bootstrapOption = isAdd ? 'removeClass' : 'addClass';
                    $(selector)[bootstrapOption]('table table-bordered')
                    $('#operations')[bootstrapOption]('btn-group').attr('role', isAdd ? 'group' : '');
                    $('#operations button')[bootstrapOption]('btn btn-default');
                })
        })
    </script>
    <style>
        .content {
            margin-left: 300px;
            margin-top: 300px;
            width: 500px;
        }
    </style>
</body>

</html>
```

#### sample2-动态列

