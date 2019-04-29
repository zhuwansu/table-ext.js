# **表格扩展工具  by zws.**

## **最佳实践**

#### sample1-动态增加行

``` html
<!DOCTYPE html>
<html>

<head>
    <title>sample1-动态增加行</title>
    <script src="https://cdn.bootcss.com/jquery/3.4.0/jquery.min.js"></script>
    <script src="table-ext.js"  type="text/javascript"></script>
</head>

<body>
    <div class="content">
        <table id="tableId">
            <thead>
                <tr>
                    <th>姓名</th>
                    <th>性别</th>
                    <th>个人描述</th>
                </tr>
            </thead>
        </table>
    </div>
    <div style="display:none">
        <table id="tableTrTemplate">
            <tbody>
                <tr>
                    <td><input name="name" /></td>
                    <td><select name="sex">
                            <option>保密</option>
                            <option>男</option>
                            <option>女</option>
                        </select></td>
                    <td><textarea name="description"></textarea></td>
                </tr>
            </tbody>
        </table>
    </div>
    <script>
        $(function () {
            var selector = '#tableId';
            var util = $(selector).tableUtil();
            util.rowHtml = $('#tableTrTemplate tbody').html();
            util.addRow();
        })
    </script>
</body>

</html>
```

1、获取表单数据

2、填充表单

3、为表格增加花里五哨的样式

#### 动态行的基础上增加动态列

#### 其他配置







