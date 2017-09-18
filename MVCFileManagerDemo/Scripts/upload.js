
    //上传对象
    var uploader = WebUploader.create({

        // 不压缩  
        resize: false,

        // swf文件路径  
        swf: 'WebUploader/Uploader.swf',

        // 文件接收服务端。  
        server: 'File/Upload',///这里需要特别注意  

        // 选择文件的按钮。可选。  
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.  
        pick: '#picker',
        //当前地址
        //formData: { path: currentPath }
    });

    // 当有文件添加进来的时候  
    uploader.on('fileQueued', function (file) {
        $list.append('<div id="' + file.id + '" class="item">' +
            '<h4 class="info">' + file.name + '</h4>' +
            '<p class="state">等待上传...</p>' +
            '</div>');
    });

    // 文件上传过程中创建进度条实时显示。  
    uploader.on('uploadProgress', function (file, percentage) {
        var $li = $('#' + file.id),
            $percent = $li.find('.progress .progress-bar');

        // 避免重复创建  
        if (!$percent.length) {
            $percent = $('<div class="progress progress-striped active">' +
                '<div class="progress-bar" role="progressbar" style="width: 0%">' +
                '</div>' +
                '</div>').appendTo($li).find('.progress-bar');
        }

        $li.find('p.state').text('上传中');

        $percent.css('width', percentage * 100 + '%');
    });
    //上传成功后
    uploader.on('uploadSuccess', function (file, response) {
        $('#' + file.id).find('p.state').text('已上传');

        var path = response.filePath;
        $("#download").attr("href", response.filePath);//resporse  是重点

    });

    //上传错误
    uploader.on('uploadError', function (file) {
        $('#' + file.id).find('p.state').text('上传出错');
    });
    //上传完成
    uploader.on('uploadComplete', function (file) {
        $('#' + file.id).find('.progress').fadeOut();

    });

  



//上传附件
//var Upload = {
//    //创建实例
//    createNew: function (type, title) {
//        var up_obj = {};
//        up_obj.title = title;
//        up_obj.type = type;
//        up_obj.onComplete = null;
//        up_obj.openDialog = function (id, locked) {
//            if (locked == null || locked == undefined) locked = false;
//            //$.messager.progress();
//            var domId = 'upload_newgis_' + up_obj.type;
//            var dlg = '<div id="' + domId + '" class="easyui-dialog" style="overflow: hidden;"';
//            dlg = dlg + 'data-options="iconCls:\'icon-attach\',buttons: [{text:\'确定\',iconCls:\'icon-ok\',handler:function(){$(\'#' + domId + '\').dialog(\'close\')}}],closed: true,width: 600,height: 460,">';
//            //dlg = dlg + "<iframe id='ifm_" + up_obj.type + "' frameborder='0' style='width:100%;height:100%;border-width:0px;' src='/Sys/Upload/Index?id=" + id + "&type=" + up_obj.type + "&locked=" + locked + "&rn=" + Math.random() + "'></iframe>";
//            dlg = dlg + '</div>';
//            //移除已有的对话框HTML代码
//            $('#' + domId).remove();
//            //将对话框内HTML代码加入到body中
//            $("body").append(dlg);
//            //弹出对话框
//            $('#' + domId).dialog({
//                cache: false,
//                closable: true,
//                title: up_obj.title,
//                content: "<iframe id='ifm_" + domId + "' frameborder='0' style='width:100%;height:100%;border-width:0px;' src='/Sys/Upload/Index?id=" + id + "&type=" + up_obj.type + "&locked=" + locked + "&rn=" + Math.random() + "'></iframe>",
//                onClose: function () {
//                    if (up_obj.onComplete) {
//                        up_obj.onComplete(id, up_obj.type);
//                    }
//                }
//            }).dialog('center').dialog('open');
//            //iframe 加载事件监听，完成加载后
//            //$("#ifm_" + up_obj.type).load(function () {
//            //    $.messager.progress('close');
//            //});
//        }
//        up_obj.getFilesCount = function (id, fn) {
//            //var count = 0;
//            $.ajax({
//                url: '/Upload/GetFilesCount',
//                data: { id: id, type: up_obj.type },
//                cache: false,
//                type: "POST",
//                success: function (data) {
//                    data = JSON.parse(data);
//                    if (data.result == "ok") {
//                        if (fn) fn(data.Count);
//                    }
//                    else {
//                        $.messager.alert('提示信息', data.message, 'warning');
//                    }
//                },
//                error: function (e) {
//                    //表单提交时发生错误的操作
//                    httpError(e.responseText);
//                }
//            });
//            //return count;
//        }
//        up_obj.clear = function (fn) {
//            $.ajax({
//                url: '/Upload/Clear',
//                data: { type: up_obj.type },
//                cache: false,
//                type: "POST",
//                success: function (data) {
//                    data = JSON.parse(data);
//                    if (data.result == "ok") {
//                        if (fn) fn();
//                    }
//                    else {
//                        $.messager.alert('提示信息', data.message, 'warning');
//                    }
//                },
//                error: function (e) {
//                    //表单提交时发生错误的操作
//                    httpError(e.responseText);
//                }
//            });
//        }
//        return up_obj;
//    }
//}


