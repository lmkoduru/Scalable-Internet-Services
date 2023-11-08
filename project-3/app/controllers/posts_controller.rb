class PostsController < ApplicationController
    def new
        # important to ensure @user in _form is not nil
        @user = User.find(params[:user_id])
        @post = @user.posts.new
    end
  
    def create
        @user = User.find(params[:user_id])
        @post = @user.posts.build(post_params)
        if @post.save
          redirect_to root_path
        else
          render :new, status: :unprocessable_entity
        end
    end
  
  
    def edit
          @user = User.find(params[:user_id])
          @post = @user.posts.find(params[:id])
    end
    
    def update
        @user = User.find(params[:user_id])
        @post = @user.posts.find(params[:id])
      
        if @post.update(post_params)
            redirect_to root_path
        else
            render :edit, status: :unprocessable_entity
        end
    end
  
    def destroy
        @user = User.find(params[:user_id])
        @post = @user.posts.find(params[:id])
        @post.destroy
      
        redirect_to root_path, status: :see_other
    end
      
    private
        def post_params
            params.require(:post).permit(:body, :title)
        end
end
