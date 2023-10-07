<template>
  <div>
    <el-form :inline="true" v-model="msg" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="msg" placeholder="输入商品id或者商品名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.prevent="selectMsg(msg)"
          >查询</el-button
        >
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border style="width: 100% color: blue">
      <el-table-column fixed prop="productId" label="商品编号" width="150">
      </el-table-column>
      <el-table-column prop="productName" label="商品名称" width="150">
      </el-table-column>
      <el-table-column prop="soldNum" label="销量" width="150">
      </el-table-column>
      <el-table-column prop="productStatus" label="商品状态" width="150">
      </el-table-column>

      <el-table-column prop="address" label="评论管理" width="80">
      </el-table-column>
      <el-table-column prop="address" label="规格管理" width="80">
      </el-table-column>
      <el-table-column prop="address" label="参数管理" width="80">
      </el-table-column>
      <el-table-column prop="address" label="图片管理" width="80">
      </el-table-column>

      <el-table-column prop="createTime" label="商品上架时间" width="120">
      </el-table-column>
      <el-table-column prop="updateTime" label="商品修改时间" width="120">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            @click="getOne(scope.row.productId)"
            type="text"
            size="small"
            >查看</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="updateOne(scope.row.productId)"
            >编辑</el-button
          >
          <el-button type="text" @click="delOne(scope.row.productId)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="Total"
    >
    </el-pagination>

    <!-- //查看页面 -->
    <el-dialog title="商品信息" :visible.sync="dialogFormVisible">
      <el-form :model="product">
        <el-form-item label="商品Id" :label-width="formLabelWidth">
          <el-input v-model="product.productId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品名称" :label-width="formLabelWidth">
          <el-input v-model="product.productName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类Id" :label-width="formLabelWidth">
          <el-input v-model="product.categoryId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="隶属分类id" :label-width="formLabelWidth">
          <el-input
            v-model="product.rootCategoryId"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="已售" :label-width="formLabelWidth">
          <el-input v-model="product.soldNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="商品状态"
          :label-width="formLabelWidth"
          color="blue"
        >
          <input type="radio" value="1" v-model="product.productStatus" />在售
          <input type="radio" value="0" v-model="product.productStatus" />不在售
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- //编辑页面 -->
    <el-dialog title="编辑商品" :visible.sync="edit">
      <el-form :model="product">
        <el-form-item label="商品Id" :label-width="formLabelWidth">
          <el-input v-model="product.productId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品名称" :label-width="formLabelWidth">
          <el-input v-model="product.productName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类Id" :label-width="formLabelWidth">
          <el-input v-model="product.categoryId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="隶属分类id" :label-width="formLabelWidth">
          <el-input
            v-model="product.rootCategoryId"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="已售" :label-width="formLabelWidth">
          <el-input v-model="product.soldNum" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item
          label="商品状态"
          :label-width="formLabelWidth"
          color="blue"
        >
          <input type="radio" value="1" v-model="product.productStatus" />启售
          <input type="radio" value="0" v-model="product.productStatus" />禁售
        </el-form-item>

        <el-form-item label="商品评论" :label-width="formLabelWidth">
          <el-input v-model="product.content" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品创建时间" :label-width="formLabelWidth">
          <el-input v-model="product.createTime" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="edit = false">取 消</el-button>
        <el-button type="primary" @click="updateProduct(product)"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getList } from "@/api/product";
import { selectOne } from "@/api/product";
import { updateOne } from "@/api/product";
import { delOne } from "@/api/product";
import { selectByName } from "@/api/product";

export default {
  data() {
    return {
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      Total: 10,
      dialogFormVisible: false,
      edit: false,
      product: {},
      formLabelWidth: "120px",
      radio: 1,
      msg: "",
    };
  },
  methods: {
    //通过商品id和商品姓名查询
    selectMsg: function (msg) {
      let _this = this;
      selectByName(msg).then((res) => {
        if (res.code == 0) {
          console.log(res);
          _this.tableData = res.data.records;
          this.$message({
            showClose: true,
            message: res.msg,
            type: "success",
          });
        } else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: "error",
          });
        }
      });
    },
    //通过id查询

    //通过商品名称查询
    delOne: function (productId) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delOne(productId).then((res) => {
            this.getProduct(this.pageNum, this.pageSize);
            if (res.code == 0) {
              this.$message({
                showClose: true,
                message: res.msg,
                type: "success",
              });
            } else {
              this.$message({
                showClose: true,
                message: res.msg,
                type: "error",
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //修改商品之前 查询商品，将商品的信息渲染在页面上面
    updateOne: function (id) {
      let _this = this;
      this.edit = true;
      selectOne(id).then((res) => {
        _this.product = res.data;
        _this.status = res.data.productStatus;
        console.log(res);
        if (res.code == 0) {
          this.$message({
            showClose: true,
            message: res.msg,
            type: "success",
          });
        } else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: "error",
          });
        }
      });
    },
    //修改商品，修改之前， 把商品弹窗关闭，修改之后，重新查询商品
    updateProduct: function (product) {
      this.edit = false;
      updateOne(product).then((res) => {
        console.log(product);
        this.getProduct(this.pageNum, this.pageSize);
        if (res.code == 0) {
          this.$message({
            showClose: true,
            message: res.msg,
            type: "success",
          });
        } else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: "error",
          });
        }
      });
    },
    //通过id查询单个商品
    getOne: function (id) {
      let _this = this;
      _this.dialogFormVisible = true;
      selectOne(id).then((res) => {
        _this.product = res.data;
        _this.radio = `${res.data.productStatus}`;
      });
    },
    //分页查询多个商品
    getProduct: function (pageNum, pageSize) {
      let _this = this;
      getList(pageNum, pageSize).then((res) => {
        _this.tableData = res.data.records;
        _this.pageNum = res.data.current;
        _this.pageSize = res.data.size;
        _this.Total = res.data.total;
      });
    },
    //页表查询
    handleSizeChange(val) {
      this.getProduct(this.pageNum, val);
    },
    handleCurrentChange(val) {
      this.getProduct(val, this.pageSize);
    },
  },
  //钩子函数
  mounted: function () {
    this.getProduct(this.pageNum, this.pageSize);
  },
};
</script>

<style></style>
