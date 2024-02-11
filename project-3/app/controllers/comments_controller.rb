class CommentsController < ApplicationController
    def new
        @post = Post.find(params[:post_id])
        @comment = @post.comments.new
    end

    def create
        @post = Post.find(params[:post_id])
        @comment = @post.comments.build(comment_params)
        if @comment.save
          redirect_to root_path
        else
          render :new, status: :unprocessable_entity
        end
    end

    def edit
        @post = Post.find(params[:post_id])
        @comment = @post.comments.find(params[:id])
    end
  
    def update
        @post = Post.find(params[:post_id])
        @comment = @post.comments.find(params[:id])
    
        if @comment.update(comment_params)
          redirect_to root_path
        else
          render :edit, status: :unprocessable_entity
        end
    end

    def destroy
        @post = Post.find(params[:post_id])
        @comment = @post.comments.find(params[:id])
        @comment.destroy
    
        redirect_to root_path, status: :see_other
    end

    private
        def comment_params
          params.require(:comment).permit(:commenter, :body)
        end
end
