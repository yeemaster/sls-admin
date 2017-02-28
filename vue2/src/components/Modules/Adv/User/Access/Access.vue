<template>
    <div>
        <el-tree
            class="filter-tree"
            show-checkbox
            default-expand-all
            node-key="path"
            :data="accesss"
            :props="defaultProps"
            :filter-node-method="filterNode"
            @check-change='checkChange'
            @current-change='currentChange'
            @node-click='nodeClick'
            ref="accesss">
        </el-tree>

        <el-select v-model="user_id" multiple placeholder="请选择用户">
            <el-option 
                v-for='user in user_list'
                :value='user.id'
                :label='user.username'></el-option>
        </el-select>

        <div class="buttons">
            <el-button @click="setUserAccess">设置权限</el-button>
        </div>
    </div>
</template>
<script>
    import AccessJs from './Access.js';
    module.exports=AccessJs;
</script>
<style scoped>
    .edit-form{
        width:500px;
    }
</style>
