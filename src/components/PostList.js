import SinglePost from "./SinglePost";

export default function PostList({posts}){
    return(
        posts.map((p) => (
            <SinglePost
              key={p.posts_id}
              postOwner_id={p.user_id}
              posts_id={p.posts_id}
              link={p.link}
              md_description={p.md_description}
              md_title={p.md_title}
              md_image={p.md_image}
              description={p.description}
              name={p.name}
              image={p.image}
            /> 
          ))
    )
}