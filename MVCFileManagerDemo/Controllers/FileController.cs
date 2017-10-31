using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FileHelper;
using System.IO;

namespace MVCFileManagerDemo.Controllers
{
    public class FileController :Controller
    {
        // GET: File
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 是否具有管理共享文件夹权限
        /// </summary>
        /// <returns></returns>
       
        public JsonResult AdminShare()
        {
            object obj = new { result ="true" };
            return Json(obj, "text/html", JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 具有管理共享文件权限，只用于判断无其他用处
        /// </summary>
        /// <returns></returns>
        public string Share()
        {
            return "ok";
        }

        /// <summary>
        /// 获取当前目录文件及文件夹列表
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public JsonResult GetFiles(string path)
        {
            string basePath = Server.MapPath("~");
            //得到文件夹路径
            var data = FileHelper.FileHelp.GetFiles(basePath, path,true);
            return Json(FileHelp.GetFiles(basePath, path,true), "text/html", JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 获取目录结构
        /// </summary>
        /// <returns></returns>
        public JsonResult GetDirectory(string id, string file)
        {
            string basePath = Server.MapPath("~");
            if (id==null)
            {
                id = "all";
                file = "open";
            }
            
            try
            {
                var dd = (FileHelper.FileHelp.GetDirectoryTree(basePath, id, file));
                return Json(FileHelper.FileHelp.GetDirectoryTree(basePath, id, file), "text/html", JsonRequestBehavior.AllowGet);
            }
            catch (Exception)
            {

                return Json(new { result = "no" });
            }
          
        }

        /// <summary>
        /// 创建目录
        /// </summary>
        /// <param name="basePath"></param>
        /// <param name="path"></param>
        /// <returns></returns>
        public JsonResult CreateFolder(string path)
        {
            string basePath = Server.MapPath("~");
            return Json(FileHelp.CreateFolder(basePath, path), "text/html", JsonRequestBehavior.AllowGet);
        }

        // <summary>
        /// 删除
        /// </summary>
        /// <param name="basePath"></param>
        /// <param name="files"></param>
        /// <returns></returns>
        public JsonResult Delete(string file)
        {
            string basePath = Server.MapPath("~");
            string[] files = file.Split('|');
            return Json(FileHelp.Delete(basePath, files), "text/html", JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 文件移动
        /// </summary>
        /// <returns></returns>
        public JsonResult Move(string path, string file)
        {
            string basePath = Server.MapPath("~");
            string[] files = file.Split('|');
            return Json(FileHelp.Move(basePath, path, files), "text/html", JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 文件复制
        /// </summary>
        /// <returns></returns>
        public JsonResult Copy(string path, string file)
        {
            string basePath = Server.MapPath("~");
            string[] files = file.Split('|');
            return Json(FileHelp.Copy(basePath, path, files), "text/html", JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 重命名
        /// </summary>
        /// <param name="oldFileName"></param>
        /// <param name="newFileName"></param>
        /// <returns></returns>
        public JsonResult Rename(string path, string oldFileName, string newFileName, string type)
        {
            string basePath = Server.MapPath("~");
            return Json(FileHelp.Rename(basePath, path, oldFileName, newFileName, type), "text/html", JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 压缩文件和文件夹
        /// </summary>
        /// <param name="oldFileName"></param>
        /// <param name="newFileName"></param>
        /// <returns></returns>
        public JsonResult Zip(string path, string zipName, string file)
        {
            string basePath = Server.MapPath("~");
            string[] files = file.Split('|');
            //压缩文件
           var resultJson =  FileHelp.Zip(basePath, path, zipName, files);
            return Json(resultJson, "text/html", JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 上传文件
        /// </summary>
        /// <param name="path"></param>
        /// <returns></returns>
        public JsonResult Upload(HttpPostedFileBase file)
        {
            //上传文件
            string basePath = Server.MapPath("~");//根地址
            var currentPath = Request["currentPath"];//获取文件保存的相对地址  
            //文件保存的绝对位置
            string thePath = string.Format(@"{0}Document\Files\{1}", basePath, currentPath);
            if (file!=null)
            {
                string fileName = Path.GetFileName(file.FileName);//文件名
                string fileExt = Path.GetExtension(fileName);//文件扩展名
                if (!Directory.Exists(thePath)) //   创建文件夹
                {
                    Directory.CreateDirectory(thePath);
                }
                string filePathName = thePath + "\\" + fileName;
                file.SaveAs(filePathName);//保存文件
                var result =  Json(new { state="ok",path= filePathName },JsonRequestBehavior.DenyGet);
                return result;
            }

            return Json(new { state = "no", path = "null" }, JsonRequestBehavior.DenyGet);
        }

        /// <summary>
        /// 下载选择文件
        /// <param name="path">在Files文件夹下的地址</param>
        /// <param name="file"></param>
        /// </summary>
        public void Download(string path, string file)
        {
            //文件名数组
            string[] files = file.Split('|');
            string basePath = Server.MapPath("~");
            basePath = string.Format(@"{0}Document", basePath);
            path = string.Format(@"{0}\Files\{1}", basePath, path);
            //新文件夹名
            
            string newFileName = string.Format(@"{0}\Temp\临时文件_{1}", basePath, DateTime.Now.ToString("yyyyMMddhhmmss"));
            //文件个数大于2
            if (files.Count()>1)
            {
              string fileName=   FileHelp.Download(path, files, newFileName);
                GetDocument(fileName, true);
            }
            else
            {
                
                string[] thepath = files[0].Split('*');              
                string fileName = string.Format(@"{0}\{1}", path, thepath[0]);
                //下载文件
                GetDocument(fileName, false);
            }

            
           
        }


        /// <summary>
        /// 压缩文件并返回文件
        /// </summary>
        /// <param name="path">绝对路径</param>
        private void  GetDocument(string path,bool isDelete) {
            
            string basePath = Server.MapPath("~");
            //原始文件夹地址
            string oldFilePath = FileHelp.Standard(path);
            //压缩文件名
            string zipName = string.Format("下载_{0}", DateTime.Now.ToString("yyyyMMddhhmmss"));
            //新地址
            var filePath = string.Format(@"{0}\Document\Temp\{1}.zip", basePath, zipName).Replace(@"\\", @"\");
            //生成压缩文件
            if (ZIPHelper.Compress(oldFilePath, filePath, true))
            {
                FileStream fs = new FileStream(filePath, FileMode.Open);
                byte[] bytes = new byte[(int)fs.Length];
                fs.Read(bytes, 0, bytes.Length);
                fs.Close();
                //是否删除原文件
                if (isDelete)
                {
                    FileHelp.Delete(path);
                }
                //删除生成的压缩文件
                FileHelp.Delete(filePath);
                Response.ContentType = "application/octet-stream";
                //通知浏览器下载文件而不是打开
                Response.AddHeader("Content-Disposition", "attachment; filename=" + HttpUtility.UrlEncode(filePath, System.Text.Encoding.UTF8));
                Response.BinaryWrite(bytes);
                Response.Flush();
                Response.End();
              
               
             
            }
            else
            {
                Response.ContentType = "application/ text/html";
                Response.Flush();
                Response.End();
                Response.ClearHeaders();
            }




        }
    }
}