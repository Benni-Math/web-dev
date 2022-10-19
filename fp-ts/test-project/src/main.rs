use std::net::TcpListener;
use web_server::{
    handle_connection,
    ThreadPool,
};
fn  main() {
    let listener = TcpListener::bind("127.0.0.1:7878").unwrap();
    println!("Listening at 127.0.0.1:7878");

    let pool = ThreadPool::new(4);

    for stream in listener.incoming().take(100) {
        let stream = stream.unwrap();

        pool.execute(|| {
            handle_connection(stream);
        });
    }

    println!("Shutting down.")
}
