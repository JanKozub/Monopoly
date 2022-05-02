class Net {
    static getPostData(url, data) {
        return new Promise((resolve) => {
            $.ajax({
                url: url,
                type: 'POST',
                data: data,
                success: (data) => resolve(JSON.parse(data))
            });
        });
    }
}