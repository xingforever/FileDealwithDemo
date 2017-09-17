//var upload = Upload.createNew("File", "上传附件");
$(function () {
   // adminShare();//是否具备管理公共文件夹权限
    initData('public');
    loadTree();
   // upload.title = '上传附件';
    //upload.onComplete = function (id) {
    //    $.ajax({
    //        url: '/File/Upload',
    //        data: { path: currentPath },
    //        cache: false,
    //        type: "POST",
    //        success: function (data) {
    //            data = JSON.parse(data);
    //            if (data.result == "ok") {
    //                $('#dg').datagrid('reload', { path: currentPath }); //更新列表信息
    //                $.messager.alert('提示信息', '上传成功！', 'info');
    //            }
    //            else if (data.result == "error") {
    //                $.messager.alert('提示信息', data.message, 'warning');
    //            }
    //        },
    //        error: function (e) {
    //            //表单提交时发生错误的操作
    //            httpError(e.responseText);
    //        },
    //        beforeSend: function (XMLHttpRequest) {
    //            $.messager.progress();	//开启等待进度条
    //        },
    //        complete: function (XMLHttpRequest, textStatus) {
    //            $.messager.progress('close');	//关闭等待进度条
    //        }
    //    });
    //}

});

var currentPath; //当前路径
var canAdminShare = false;

//权限判断  
function canAdmin() {
    return true;
}
//权限
function adminShare() {
    $.ajax({
        url: '/File/AdminShare',
        cache: false,
        type: "POST",
        success: function (data) {
            data = JSON.parse(data);
            if (data.result == "true") 
                canAdminShare = true;
            else
                canAdminShare = false;
        },
        error: function (e) {
            //表单提交时发生错误的操作
            httpError(e.responseText);
        },
        beforeSend: function (XMLHttpRequest) {
            $.messager.progress();	//开启等待进度条
        },
        complete: function (XMLHttpRequest, textStatus) {
            $.messager.progress('close');	//关闭等待进度条
        }
    });
}

//数据初始化
function initData(param) {
    currentPath = param;
    $('#dg').datagrid({
        url: '/File/GetFiles',
        iconCls: 'sys_table',
        //idField: 'path',
        singleSelect: true,
        checkbox: true,
        rownumbers: true,
        selectOnCheck: false,
        checkOnSelect: false,
        queryParams: { path: param },
        toolbar: '#toolbar',
        fit: true,
        columns: [[
            { field: 'ck', checkbox: true },
            {
                title: '名称', field: 'filename', formatter: function (value, row) {
                    return "<img src=\"" + row.typeIcon + "\" style='border:0px;vertical-align:middle;margin:0px 5px 0px 2px'><lable>" + value + "</lable>";
                }, width: 220
            },
            { title: '类型/大小', field: 'size', align: 'right', width: 80 },
            { title: '创建时间', field: 'createtime', width: 120 },
            { title: '更新时间', field: 'updatetime', width: 120 }
        ]],
        onLoadError: function (e) { //当用户登录超时，绑定数据发生
            httpError(e.responseText);
        },
        onRowContextMenu: function (e, index, row) {
            e.preventDefault();
            $('#contextMenu').menu('show', {
                left: e.pageX,
                top: e.pageY
            });
        },
        onDblClickRow: function (index, row) {
            if (row.size == '文件夹')
                initData(row.path); //更新列表信息
        },
        onCheck: function (index, row) {
            var rows = $('#dg').datagrid('getChecked');
            ctrlBtn(rows);
        },
        onUncheck: function (index, row) {
            var rows = $('#dg').datagrid('getChecked');
            ctrlBtn(rows);
        },
        onCheckAll: ctrlBtn,
        onUncheckAll: function (rows) {
            ctrlBtn(null);
        },
        onLoadSuccess: function (data) {
            $('#dg').datagrid('clearChecked'); //清空选择
            ctrlBtn(null);
        }
    });
}

//控制控件是否有效
function ctrlBtn(rows) {
    if (canAdmin()) {
        $('#btnCreateFolder').linkbutton('enable');
        $('#btnUploadTool').linkbutton('enable');
    }
    else {
        $('#btnCreateFolder').linkbutton('disable');
        $('#btnUploadTool').linkbutton('disable');
    }
    if (rows && rows.length > 0) {
        if (rows.length == 1 && canAdmin()) {
            $('#btnRe').linkbutton('enable');
            $('#contextMenu').menu('enableItem', $('#menuRe')[0]);
        }
        else {
            $('#btnRe').linkbutton('disable');
            $('#contextMenu').menu('disableItem', $('#menuRe')[0]);
        }
        if (canAdmin()) {
            $('#btnDel').linkbutton('enable');
            $('#contextMenu').menu('enableItem', $('#menuDel')[0]);
            $('#btnCut').linkbutton('enable');
            $('#contextMenu').menu('enableItem', $('#menuCut')[0]);
            $('#btnZip').linkbutton('enable');
            $('#contextMenu').menu('enableItem', $('#menuZip')[0]);
        }
        else {
            $('#btnDel').linkbutton('disable');
            $('#contextMenu').menu('disableItem', $('#menuDel')[0]);
            $('#btnCut').linkbutton('disable');
            $('#contextMenu').menu('disableItem', $('#menuCut')[0]);
            $('#btnZip').linkbutton('disable');
            $('#contextMenu').menu('disableItem', $('#menuZip')[0]);
        }
        $('#btnCopy').linkbutton('enable');
        $('#btnDown').linkbutton('enable');
        $('#contextMenu').menu('enableItem', $('#menuCopy')[0]);
        $('#contextMenu').menu('enableItem', $('#menuDown')[0]);
    }
    else {
        $('#btnRe').linkbutton('disable');
        $('#btnDel').linkbutton('disable');
        $('#btnCut').linkbutton('disable');
        $('#btnCopy').linkbutton('disable');
        $('#btnZip').linkbutton('disable');
        $('#btnDown').linkbutton('disable');
        $('#contextMenu').menu('disableItem', $('#menuRe')[0]);
        $('#contextMenu').menu('disableItem', $('#menuDel')[0]);
        $('#contextMenu').menu('disableItem', $('#menuCut')[0]);
        $('#contextMenu').menu('disableItem', $('#menuCopy')[0]);
        $('#contextMenu').menu('disableItem', $('#menuZip')[0]);
        $('#contextMenu').menu('disableItem', $('#menuDown')[0]);
    }
    if (currentPath == "\\")
        $('#btnUp').linkbutton('disable');
    else
        $('#btnUp').linkbutton('enable');
}

//树图
function loadTree() {
    $('#ftree').tree({
        url: '/File/GetDirectory',
        onLoadError: function (e) { //当用户登录超时，绑定数据发生
            httpError(e.responseText);
        },
        onClick: function (node) {
            initData(node.id); //更新列表信息
        }
    });
}

//创建文件夹
function createFolder() {
    $.messager.prompt('创建新文件夹', '请输入新文件夹名称', function (r) {
        if (r) {
            $.ajax({
                url: '/File/CreateFolder',
                data: { path: currentPath + '\\' + r },
                cache: false,
                type: "POST",
                success: function (data) {
                    data = JSON.parse(data);
                    if (data.result == "ok") {
                        $('#dg').datagrid('reload', { path: currentPath }); //更新列表信息
                        var node = $('#ftree').tree('find', currentPath);
                        if (node)
                            $('#ftree').tree('reload', node.target);//更新目录结构树信息
                        $.messager.alert('提示信息', '创建成功！', 'info');
                    }
                    else {
                        $.messager.alert('提示信息', data.message, 'warning');
                    }
                },
                error: function (e) {
                    //表单提交时发生错误的操作
                    httpError(e.responseText);
                },
                beforeSend: function (XMLHttpRequest) {
                    $.messager.progress();	//开启等待进度条
                },
                complete: function (XMLHttpRequest, textStatus) {
                    $.messager.progress('close');	//关闭等待进度条
                }
            });
        }
    });
}

//刷新当前列表信息
function refersh() {
    initData(currentPath); //更新列表信息
}

//向上
function up() {
    if (currentPath == "\\") {
        $.messager.alert('提示信息', "您已经到根目录了！", 'warning');
    }
    else {
        var parent;
        if (currentPath.lastIndexOf("\\") > 0) {
            parent = currentPath.substring(0, currentPath.lastIndexOf("\\"));
        }
        else {
            parent = "\\";
        }
        initData(parent); //更新列表信息
    }
}

//删除
function del() {
    var rows = $('#dg').datagrid('getChecked');
    if (rows && rows.length > 0) {
        $.messager.confirm('提示', '您确认要删除当前选择的项目吗？', function (r) {
            if (r) {
                var selected = "";
                $.each(rows, function () {
                    selected += this.path + "*" + (this.size == "文件夹" ? "0" : "1") + "|"; //将文件路径和类型也传递过去
                });
                selected = selected.substr(0, selected.length - 1);
                $.ajax({
                    url: '/File/Delete',
                    data: { file: selected },
                    cache: false,
                    type: "POST",
                    success: function (data) {
                        data = JSON.parse(data);
                        if (data.result == "ok") {
                            $('#dg').datagrid('reload', { path: currentPath }); //更新列表信息
                            $('#dg').datagrid('clearChecked'); //清空选择
                            var node = $('#ftree').tree('find', currentPath);
                            if (node)
                                $('#ftree').tree('reload', node.target);//更新目录结构树信息
                            $.messager.alert('提示信息', '删除成功！', 'info');
                        }
                        else {
                            $.messager.alert('提示信息', data.message, 'warning');
                        }
                    },
                    error: function (e) {
                        //表单提交时发生错误的操作
                        httpError(e.responseText);
                    },
                    beforeSend: function (XMLHttpRequest) {
                        $.messager.progress();	//开启等待进度条
                    },
                    complete: function (XMLHttpRequest, textStatus) {
                        $.messager.progress('close');	//关闭等待进度条
                    }
                });
            }
        });
    }
    else {
        $.messager.alert('提示信息', "请先选择需要删除的项目！", 'warning');
    }
}

//剪切和复制
function doAciton(type) {
    var rows = $('#dg').datagrid('getChecked');
    if (rows && rows.length > 0) {
        var selected = "";
        $.each(rows, function () {
            selected += this.path + "*" + (this.size == "文件夹" ? "0" : "1") + "|"; //将文件路径和类型也传递过去
        });
        selected = selected.substr(0, selected.length - 1);
        $('#dlg').dialog({ title: '目标路径选择', modal: true, buttons: '#dlg-buttons' }).dialog('open');
        $('#dtree').tree({
            url: '/File/GetDirectory',
            queryParams: { file: selected },
            onLoadError: function (e) { //当用户登录超时，绑定数据发生
                httpError(e.responseText);
            }
        });
        if (type == 'cut') {//剪切操作
            $('#btnSubmit').unbind(); //解除绑定后重新绑定
            $('#btnSubmit').bind("click", function () {
                var node = $('#dtree').tree('getSelected');
                if (node) {
                    $.ajax({
                        url: '/File/Move',
                        data: { path: node.id, file: selected },
                        cache: false,
                        type: "POST",
                        success: function (data) {
                            data = JSON.parse(data);
                            if (data.result == "ok") {
                                $('#dg').datagrid('reload', { path: currentPath }); //更新列表信息
                                var node1 = $('#ftree').tree('find', currentPath);
                                if (node1)
                                    $('#ftree').tree('reload', node1.target);//更新目录结构树信息
                                var node2 = $('#ftree').tree('find', node.id);
                                if (node2)
                                    $('#ftree').tree('reload', node2.target);//更新目录结构树信息
                                $('#dlg').dialog('close');
                                $.messager.alert('提示信息', '剪切成功！', 'info');
                            }
                            else {
                                $.messager.alert('提示信息', data.message, 'warning');
                            }
                        },
                        error: function (e) {
                            //表单提交时发生错误的操作
                            httpError(e.responseText);
                        },
                        beforeSend: function (XMLHttpRequest) {
                            $.messager.progress();	//开启等待进度条
                        },
                        complete: function (XMLHttpRequest, textStatus) {
                            $.messager.progress('close');	//关闭等待进度条
                        }
                    });
                }
                else {
                    $.messager.alert('提示信息', "请选择目标文件夹！", 'warning');
                }
            });
        }
        else {
            $('#btnSubmit').unbind(); //解除绑定后重新绑定
            $('#btnSubmit').bind("click", function () {
                var node = $('#dtree').tree('getSelected');
                if (node) {
                    $.ajax({
                        url: '/File/Copy',
                        data: { path: node.id, file: selected },
                        cache: false,
                        type: "POST",
                        success: function (data) {
                            data = JSON.parse(data);
                            if (data.result == "ok") {
                                var node2 = $('#ftree').tree('find', node.id);
                                if (node2)
                                    $('#ftree').tree('reload', node2.target);//更新目录结构树信息
                                $('#dlg').dialog('close');
                                $.messager.alert('提示信息', '复制成功！', 'info');
                            }
                            else {
                                $.messager.alert('提示信息', data.message, 'warning');
                            }
                        },
                        error: function (e) {
                            //表单提交时发生错误的操作
                            httpError(e.responseText);
                        },
                        beforeSend: function (XMLHttpRequest) {
                            $.messager.progress();	//开启等待进度条
                        },
                        complete: function (XMLHttpRequest, textStatus) {
                            $.messager.progress('close');	//关闭等待进度条
                        }
                    });
                }
                else {
                    $.messager.alert('提示信息', "请选择目标文件夹！", 'warning');
                }
            });
        }
    }
    else {
        $.messager.alert('提示信息', "请先选择需要操作的项目！", 'warning');
    }
}

//重命名
function rename() {
    var rows = $('#dg').datagrid('getChecked');
    if (rows && rows.length > 0) {
        var str1 = '重命名文件';
        var str2 = '请输入新文件名称';
        var type = 1;
        if (rows[0].size == '文件夹') {
            str1 = '重命名文件夹';
            str2 = '请输入新文件夹名称';
            type = 0;
        }
        $.messager.prompt(str1, str2, function (r) {
            if (r) {
                $.ajax({
                    url: '/File/Rename',
                    data: { path: currentPath, oldFileName: rows[0].filename, newFileName: r, type: type },
                    cache: false,
                    type: "POST",
                    success: function (data) {
                        data = JSON.parse(data);
                        if (data.result == "ok") {
                            $('#dg').datagrid('reload', { path: currentPath }); //更新列表信息
                            var node = $('#ftree').tree('find', currentPath);
                            if (node)
                                $('#ftree').tree('reload', node.target);//更新目录结构树信息
                            $.messager.alert('提示信息', '重命名成功！', 'info');
                        }
                        else {
                            $.messager.alert('提示信息', data.message, 'warning');
                        }
                    },
                    error: function (e) {
                        //表单提交时发生错误的操作
                        httpError(e.responseText);
                    },
                    beforeSend: function (XMLHttpRequest) {
                        $.messager.progress();	//开启等待进度条
                    },
                    complete: function (XMLHttpRequest, textStatus) {
                        $.messager.progress('close');	//关闭等待进度条
                    }
                });
            }
        });
    }
    else {
        $.messager.alert('提示信息', "请先选择需要重命名的项目！", 'warning');
    }
}

//压缩文件
function zip() {
    var rows = $('#dg').datagrid('getChecked');
    if (rows && rows.length > 0) {
        $.messager.prompt('压缩文件', '请输入压缩文件名称', function (r) {
            if (r) {
                var selected = "";
                $.each(rows, function () {
                    selected += this.path + "*" + (this.size == "文件夹" ? "0" : "1") + "|"; //将文件路径和类型也传递过去
                });
                selected = selected.substr(0, selected.length - 1);
                $.ajax({
                    url: '/File/Zip',
                    data: { path: currentPath, zipName: r, file: selected },
                    cache: false,
                    type: "POST",
                    success: function (data) {
                        data = JSON.parse(data);
                        if (data.result == "ok") {
                            $('#dg').datagrid('insertRow', { index: 0, row: data.data });
                            $.messager.alert('提示信息', '压缩完成！', 'info');
                        }
                        else {
                            $.messager.alert('提示信息', data.message, 'warning');
                        }
                    },
                    error: function (e) {
                        //表单提交时发生错误的操作
                        httpError(e.responseText);
                    },
                    beforeSend: function (XMLHttpRequest) {
                        $.messager.progress();	//开启等待进度条
                    },
                    complete: function (XMLHttpRequest, textStatus) {
                        $.messager.progress('close');	//关闭等待进度条
                    }
                });
            }
        });
    }
    else {
        $.messager.alert('提示信息', "请先选择需要压缩的项目！", 'warning');
    }
}

//下载
function down() {
    var rows = $('#dg').datagrid('getChecked');
    if (rows && rows.length > 0) {
        var selected = "";
        $.each(rows, function () {
            selected += this.filename + "*" + (this.size == "文件夹" ? "0" : "1") + "|"; //将文件路径和类型也传递过去
        });
        selected = selected.substr(0, selected.length - 1);

        //使用表单提交方式提交请求
        var form = $("<form>");   //定义一个form表单
        form.attr('style', 'display:none');   //在form表单中添加查询参数
        form.attr('target', '');
        form.attr('method', 'post');
        form.attr('action', "/File/Download");
        var intput1 = $('<input>');
        intput1.attr('type', 'hidden');
        intput1.attr('name', 'file');
        intput1.attr('value', selected);
        var intput2 = $('<input>');
        intput2.attr('type', 'hidden');
        intput2.attr('name', 'path');
        intput2.attr('value', currentPath);
        $('body').append(form);  //将表单放置在web中 
        form.append(intput1);   //将查询参数控件提交到表单上
        form.append(intput2);   //将查询参数控件提交到表单上
        form.submit();
    }
    else {
        $.messager.alert('提示信息', "请先选择需要下载的项目！", 'warning');
    }
}

//下载对话框
function openDialog() {

    var up_obj = {};
    up_obj.title = "上传";
    up_obj.type = "";
    up_obj.onComplete = null;
    up_obj.openDialog = function (id, locked) {
        if (locked == null || locked == undefined) locked = false;
        //$.messager.progress();      
        var domId = 'upload_newgis_' + up_obj.type;
        var dlg = '<div id="' + domId + '" class="easyui-dialog" style="overflow: hidden;"';
        dlg = dlg + 'data-options="iconCls:\'icon-attach\',buttons: [{text:\'确定\',iconCls:\'icon-ok\',handler:function(){$(\'#' + domId + '\').dialog(\'close\')}}],closed: true,width: 600,height: 460,">';
        //dlg = dlg + "<iframe id='ifm_" + up_obj.type + "' frameborder='0' style='width:100%;height:100%;border-width:0px;' src='/Sys/Upload/Index?id=" + id + "&type=" + up_obj.type + "&locked=" + locked + "&rn=" + Math.random() + "'></iframe>";
        dlg = dlg + '</div>';
        //移除已有的对话框HTML代码
        $('#' + domId).remove();
        //将对话框内HTML代码加入到body中
        $("body").append(dlg);
        //弹出对话框
        $('#' + domId).dialog({
            cache: false,
            closable: true,
            title: up_obj.title,
            content: "<iframe id='ifm_" + domId + "' frameborder='0' style='width:100%;height:100%;border-width:0px;' src='File/Upload/Index?id=" + id + "&type=" + up_obj.type + "&locked=" + locked + "&rn=" + Math.random() + "'></iframe>",
            onClose: function () {
                if (up_obj.onComplete) {
                    up_obj.onComplete(id, up_obj.type);
                }
            }
        }).dialog('center').dialog('open');
        //iframe 加载事件监听，完成加载后
        //$("#ifm_" + up_obj.type).load(function () {
        //    $.messager.progress('close');
        //});

    }
}