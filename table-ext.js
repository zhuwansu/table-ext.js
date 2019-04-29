/****
 * 表格扩展工具  by zws.
 * 使用方式：var util = $(selector).tableUtil();
 *场景1：动态行
 *场景2：动态列，动态行；
 *      事件:    util.events.onAddRow:e  在添加新行时发生，参数为rowIndex 。可在初始化是传入 $table.tableUtil(onAddRow);
 *      方法：   util.initColumns:f    初始化列。
 参数.sample1:
 {
                                 name:'',
                                 placeHolder:'',//如果没有则取 name
                                 input:boolean,//为 true 表示在表格中增加输入控件（目前支持 text 、area、select）
                                 inputType:'',// input（可编辑文本）,text（可编辑文本）,checkbox,file,uploadImg（图片上传组件）,textarea,select,spanInput(普通文本，不可编辑)
                                 inputAttr:[],//额外的 attr 首先执行不会覆盖 name
                                 headerInput:{} //如果是 boolean 则取默认值 {inputType: col.inputType, placeholder: col.placeHolder, name: col.name}
                             }
 参数.sample2:
 {
                                headerInput: {inputType: 'checkbox', name: 'one', placeHolder: '一键同步'},
                                input: true,
                                inputType: "uploadImg",
                                name: "uploadImg",
                            }
 util.rows:f     获取表格数据。 参数 onRowCallback 当每获取一行数据时发生，一般用来追加或修改其他属性。
 util.addRow:f    增加新行，参数 rowHtml 将 rowHtml 追加到表格中，并触发 onAddRow 事件。

 *
 *
 *
 *
 */

(function ($) {
    'use strict';
    //table util create by zws
    var tableUtilOptions = { prefix: 'z-' };

    // auto completed support
    var autoCompletedPlugin = {
        init: function (pluginOptions) {
            if (pluginOptions) {
                autoCompletedPlugin.scope = pluginOptions.autoCompletedPlugin.scope;
            }
        },
        scope: null,
        onFillData: function ($control, data) {
            var nodeName = $control.prop('nodeName').toLowerCase();
            if (nodeName == 'select' && $control.hasClass('auto')) {
                var name = $control.attr('z-name');
                var val = data[name];
                $control.attr('auto-default-value', val);
                var display = data[name + '_display'];
                if (display) {
                    $control.attr('auto-default-text', display);
                }
            }
        },
        onPostBody: function () {
            if (autoCompletedPlugin.scope) {
                autocompleteAll(autoCompletedPlugin.scope);
            }
        }
    };
    var tableUtil = {
        prefix: tableUtilOptions.prefix,
        templates: {
            tr: '<tr class="' + tableUtilOptions.prefix + 'tr"></tr>',
            td: '<td class="' + tableUtilOptions.prefix + 'td"></td>',
            opTd: '<td class="' + tableUtilOptions.prefix + 'op-td"></td>',
            input: '<input class="' + tableUtilOptions.prefix + 'input">',
            checkbox: '<input type="checkbox" class="' + tableUtilOptions.prefix + 'check"><span class="' + tableUtilOptions.prefix + 'check"></span>',
            file: '<input class="' + tableUtilOptions.prefix + 'input" type="file">',
            uploadImg: '<div class="' + tableUtilOptions.prefix + 'uploadImg"></div><input class="' + tableUtilOptions.prefix + 'uploadImg" type="file" multiple>',
            textarea: '<textarea class="' + tableUtilOptions.prefix + 'textarea"></textarea>',
            th: '<th></th>',
            select: '<select class="' + tableUtilOptions.prefix + 'select"></select>',
            span: '<span class="' + tableUtilOptions.prefix + 'span"></span>',
            thead: '<thead><tr class="text-center"></tr></thead>',
            a: '<a class="' + tableUtilOptions.prefix + 'a" href="javascript:;" ></a>',
            add: '<a class=" ' + tableUtilOptions.prefix + 'add" href="javascript:;" >新增</a>',
            del: '<a class=" ' + tableUtilOptions.prefix + 'del" href="javascript:;" >删除</a>',
            br: '</br>',
            option: '<option></option>',
            $div: $('<div></div>'),
            span2: '<' + tableUtilOptions.prefix + 'span></' + tableUtilOptions.prefix + 'span>',
        },
        labels: {},
        rowHtml: '',
        rowIndex: 0,
        options: { debug: true },
        $table: {},
        plugins: [autoCompletedPlugin],
        events: { onAddRow: null, onFillData: null, onAppendRow: null },
        // init tableUtil bind jQuery object $table
        init: function (onAddRow, pluginOptions) {
            tableUtil.$table = $(this);
            tableUtil.$table.find('tbody').html('');
            tableUtil.events.onAddRow = onAddRow;
            tableUtil.labels = {
                input: tableUtil.templates.input,
                text: tableUtil.templates.input,
                checkbox: tableUtil.templates.checkbox,
                file: tableUtil.templates.file,
                uploadImg: tableUtil.templates.uploadImg,
                textarea: tableUtil.templates.textarea,
                select: tableUtil.templates.select,
                spanInput: tableUtil.templates.input,
            }
            tableUtil.options.appendBtn = true;
            for (var i = 0; i < tableUtil.plugins.length; i++) {
                var plugin = tableUtil.plugins[i];
                plugin.init(pluginOptions);
            }
            return tableUtil;
        },
        countTr: function () {
            return tableUtil.$table.find('tr[rowIndex]').length;
        },
        generateFormItem: function (col, header) {
            var inputType = col.inputType;
            if (!col.inputType) {
                inputType = 'spanInput';
            }
            var name = col.name;
            var attr = col.inputAttr;
            var placeHolder = col.placeHolder;
            var data = col.data;
            if (header) {
                inputType = col.headerInput.inputType;
                name = col.headerInput.name;
                attr = col.headerInput.attr;
                placeHolder = col.headerInput.placeHolder;
                data = col.headerInput.data;
            }

            var res = $(tableUtil.labels[inputType]);
            if (attr && attr.length > 0) {
                $.each(attr, function (index, item) {
                    res.attr(item.name, item.value);
                });
            }
            res.attr('placeholder', placeHolder);
            res.attr('name', name);

            if (inputType == 'select') {
                var $option = $(tableUtil.templates.option);
                $option.val('');
                $option.html(placeHolder);
                res.append($option);
                if (data && data.length > 0) {
                    $.each(data, function (sIndex, sItem) {
                        var $option = $(tableUtil.templates.option).html(sItem.name);
                        $option.attr("value", sItem.id);
                        res.append($option);
                    });
                }
            }
            res.addClass(tableUtil.prefix + inputType);
            return res;
        },
        refreshRowIndex: function () {
            while (true) {
                var last = tableUtil.$table.find('tr[rowIndex="' + tableUtil.rowIndex + '"]');
                if (last.length > 0) {
                    return last;
                }
                tableUtil.rowIndex--;
                if (tableUtil.rowIndex < 0) {
                    break;
                }
            }
        },
        // init rowHtml by options
        initRowTemplate: function (containerSelector) {
            if (containerSelector) {
                tableUtil.rowHtml = $(containerSelector + " tbody").html();
            }
            if (tableUtil.options && tableUtil.options.cols && tableUtil.options.cols.length > 0) {
                var $tr = $(tableUtil.templates.tr);
                var cols = tableUtil.options.cols;
                $.each(cols, function (index, col) {
                    var $td = $(tableUtil.templates.td);
                    if (col.id) {
                        $td.attr(tableUtil.prefix + 'columnId', col.id);
                    }
                    if (col.typeId) {
                        $td.attr(tableUtil.prefix + 'typeId', col.typeId);
                    }
                    if (col.input) {
                        var $input = tableUtil.generateFormItem(col);
                        $td.html($input);
                    }
                    $tr.append($td);
                });
                tableUtil.rowHtml = tableUtil.templates.$div.html($tr).html();
            }
        },
        // dynamic init options cols
        initColumns: function (cols) {
            if (cols) {
                tableUtil.options.cols = cols;
            }
            var $thead = $(tableUtil.templates.thead);
            $.each(cols, function (index, col) {
                var $th = $(tableUtil.templates.th);
                var $span = $(tableUtil.templates.span);
                if (!col.displayName) {
                    col.displayName = col.name;
                }
                $span.html(col.displayName);
                $th.append($span);

                //head input
                if (col.headerInput && col.input) {
                    if (col.headerInput === true) {
                        col.headerInput = {
                            inputType: col.inputType,
                            placeHolder: col.placeHolder,
                            name: col.name,
                            data: col.data
                        };
                    } else {
                        if (!col.headerInput.name) {
                            col.headerInput.name = col.name;
                        }
                        if (!col.headerInput.inputType) {
                            col.headerInput.inputType = col.inputType;
                        }
                        if (!col.headerInput.placeHolder) {
                            col.headerInput.placeHolder = col.placeHolder;
                        }
                        if (!col.headerInput.data) {
                            col.headerInput.data = col.data;
                        }
                    }
                    var $input = tableUtil.generateFormItem(col, true);

                    $th.append(tableUtil.templates.br);
                    $th.append($input);
                }

                $thead.find('tr').append($th);
            });

            tableUtil.initRowTemplate();
            $thead.find('tr').append('<th><span>操作</span></th>>');
            tableUtil.$table.html($thead);
            return this;
        },
        appendBtn: function ($tr, appendAdd, appendDel) {
            if (!tableUtil.options.appendBtn) {
                return;
            }

            //tr 默认最后一行
            if (!$tr) {
                $tr = tableUtil.refreshRowIndex();
            }
            if (!$tr || !$tr.length || $tr.length == 0) {
                return;
            }

            var $td = $tr.find('.' + tableUtil.prefix + 'op-td');
            if ($td.length == 0) {
                $td = $(tableUtil.templates.opTd);
                $tr.append($td);
            }

            $td.html('');

            if (appendAdd) {
                var $add = $(tableUtil.templates.add);
                $td.append($add);
                $td.append(tableUtil.templates.br);
            }
            var rowCount = tableUtil.countTr();
            if (appendDel && rowCount > 1) {
                var $del = $(tableUtil.templates.del);
                $td.append($del);
            }
            //注册增加和删除事件
            $tr.find('.' + tableUtil.prefix + 'add').on('click', function () {
                tableUtil.addRow();
            });
            $tr.find('.' + tableUtil.prefix + 'del').on('click', function () {
                tableUtil.removeRow($(this));
            });
        },
        // add row and render it to html by use rowHtml
        addRow: function (data) {
            //check rowHtml
            if (!tableUtil.rowHtml) {
                //try init row by cols
                this.initRowTemplate();
            }

            var $row = tableUtil.doAddRow(tableUtil.rowHtml);
            if (data) {

                //行填充数据
                var $controls = $row.find('input,select,textarea,span');
                for (var i = 0; i < $controls.length; i++) {
                    var $control = $($controls[i]);
                    var nodeName = $control.prop('nodeName').toLowerCase();
                    var name = $control.attr(tableUtil.prefix + 'name');
                    if (!name) {
                        name = $control.attr('name');
                    }
                    var value = $control.val();
                    var type = $control.attr('type');
                    // var format = $control.attr(tableUtil.prefix + 'format');
                    var oldV;
                    var v = oldV = data[name];

                    if (nodeName == 'input' && type == 'radio') {
                        //radio
                        if (value == v) {
                            $control.attr('checked', 'checked');
                        }
                    } else if (nodeName == 'span') {
                        //span
                        $control.html(v);
                    } else if (nodeName == 'input' || nodeName == 'select' || nodeName == 'textarea') {
                        // form control
                        $control.val(v);
                    }
                    //plugin injection
                    for (var j = 0; j < tableUtil.plugins.length; j++) {
                        var plugin = tableUtil.plugins[j];
                        if (plugin.onFillData) {
                            plugin.onFillData($control, data);
                        }
                    }
                }
                $row.data('oldValue', data);
            }

            if (tableUtil.events.onAddRow) {
                tableUtil.events.onAddRow(tableUtil.rowIndex, $row);
            }

            return $row;
        },
        // add rows <see f: addRow>
        addRows: function (data) {
            if (data && data.length > 0) {
                $.each(data, function (index, item) {
                    tableUtil.addRow(item);
                });

                for (var i = 0; i < tableUtil.plugins.length; i++) {
                    var plugin = tableUtil.plugins[i];
                    if (plugin.onPostBody) {
                        plugin.onPostBody();
                    }
                }
            }
        },
        // add row by row html
        doAddRow: function (rowHtml) {

            var $currentRow = tableUtil.$table.find('.' + tableUtil.prefix + 'add').parent().parent();

            tableUtil.rowIndex++;
            var $newRow = $(rowHtml);
            $newRow.attr('rowIndex', tableUtil.rowIndex);
            $newRow.addClass(tableUtil.prefix + 'tr');

            //name 增加 rowIndex
            $newRow.find('input,select,textarea').attr(tableUtil.prefix + 'name', function () {
                return this.name;
            });
            $newRow.find('input,select,textarea').attr('name', function (n, v) {
                return v + tableUtil.rowIndex;
            });
            tableUtil.$table.append($newRow);

            //添加新行后增加新增和删除按钮
            tableUtil.appendBtn($newRow, true, true);
            //把当前行修改为删除按钮
            tableUtil.appendBtn($currentRow, false, true);

            return $newRow;
        },
        //remove current row
        removeRow: function ($this) {
            var rowIndex = $this.parent().parent().attr('rowIndex');
            tableUtil.removeRowByIndex(rowIndex);
        },
        //removeRow by rowIndex
        removeRowByIndex: function (rowIndex) {
            var rowCount = tableUtil.countTr();
            if (rowCount < 2) {
                return;
            }
            tableUtil.$table.find('[rowIndex="' + rowIndex + '"]').remove();
            var $tr = tableUtil.refreshRowIndex();
            tableUtil.appendBtn($tr, true, true);
        },
        // generate a form serialize object for every row , like this [{},{}]
        rows: function (onRowCallback, onFieldCallBack) {
            var params = [];
            $('[rowIndex]').each(function (index, item) {
                var oldValue = $(item).data('oldValue');
                var rowIndex = $(item).attr('rowIndex');
                var obj = {};
                if (oldValue) {
                    obj.id = oldValue.id;
                }

                $.each($(item).find('input,select,textarea'), function (cIndex, cItem) {
                    var name = $(cItem).attr(tableUtil.prefix + 'name');
                    var val = $(cItem).val();
                    if (cItem.type == 'radio') {
                        if (name && cItem.checked === true) {
                            obj[name] = val;
                        }
                    } else if (name) {
                        obj[name] = val;
                    }

                    if (onFieldCallBack) {
                        onFieldCallBack(obj, cItem);
                    }
                });


                $.extend(obj, { rowIndex: rowIndex });
                if (onRowCallback) {
                    onRowCallback(obj, $(item));
                }
                params.push(obj);
            });
            if (tableUtil.debug()) {
                console.log("table-ext.js:rows");
                console.log(JSON.stringify(params));
            }
            return params;
        },
        debug: function () {
            return tableUtil.options.debug;
        }

    };

    $.fn.extend({ tableUtil: tableUtil.init });

}(window.jQuery));
