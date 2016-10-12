<template>
    <div class="page-header position-relative">
        <div class="header-title">
            <h1>服务号意见反馈</h1>
        </div>
    </div>
    <div class="page-body">


        <div class="row">
            <div class="col-xs-12 col-md-12">
                <div v-if=" items.length>0" class="well with-header  with-footer">
                    <div class="comment" v-for="item in items">
                        <img v-bind:src="item.wxImg" alt="" class="comment-avatar">
                        <div class="comment-body">
                            <div class="comment-text">
                                <div class="comment-header">
                                    <a title="">{{item.wxAlias}}{{item.phoneNo}}</a><span>{{item.createDate | date 'YYYY-MM-DD HH:mm'}}</span>

                                </div>
                                {{item.content}}
                                <div class="databox-left no-padding">
                                    <tooltip
                                            effect="scale"
                                            placement="bottom"  v-for="imgUrl in item.image_list">


                                        <img slot="tooltip-inner" v-bind:src="imgUrl" width="300"  slot="modal-body"></img>

                                        <img v-bind:src="imgUrl"  style="width:65px; height:65px;"  class="img-rounded"></img>



                                    </tooltip>
                                </div>
                            </div>

                            <!--<div class="comment-footer">
                                <a href="#"><i class="fa fa-thumbs-o-up"></i></a>
                                <a href="#"><i class="fa fa-thumbs-o-down"></i></a>
                                <a href="#">Reply</a>
                            </div>-->
                        </div>

                    </div>
                    <pagination v-if="totalPage>1" :page-per-rows="rows" :total-page="totalPage" :cur-page.sync="curPage" :total-row="totalRows"></pagination>
                </div>
                <div class="no_com" v-else>暂无评价</div>
            </div>
        </div>
</template>
<style>
    .no_com{font-size: 18px;text-align: center}
</style>
<script>

    import pagination from './common/Pagination.vue'
    import modal from './common/Modal.vue'
    import * as ajaxUtil from '../util/Ajax.js'
    import tooltip from './common/Tooltip.vue'
    export default {
        data () {
            return {
                items: [],
                curPage:1,
                rows:10,
                totalPage:0,
                totalRows:0,

            }
        },

        route: {
            data ({to,next}) {
            }
        },
        components: {
            pagination,
            modal,
            tooltip
        },
        ready () {
            this.updateData();
        },
        methods: {

            updateData () {
                let params = {};
                params.offset = (this.curPage-1)* this.rows;
                params.limit = this.rows;

                let url = Url.FETCH_SERVER_IDEA_FEEDBACK;


                ajaxUtil.doGet(url,params).then((xhr,response) =>{

                    if(response.returnCode=="success"){

                        var items =response.feedbacks ;
                        this.items = items;
                        this.totalRows = response.totalRows;
                        if(response.totalRows%this.rows == 0){
                            this.totalPage = Math.floor(response.totalRows/this.rows) ;
                        }else{
                            this.totalPage = Math.floor(response.totalRows/this.rows) +1;
                        }

                    }else{
                        return ajaxUtil.doError(response,this);
                    }


            })


            }


        },
        watch:{
            curPage () {
                this.updateData()
            },

        }
    }
</script>