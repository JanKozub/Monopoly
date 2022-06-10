class Net {
    static async sendPostData(url, data) {
        return await new Promise((resolve) => {
            $.ajax({
                url: url,
                type: 'POST',
                data: data,
                success: (data) => resolve(JSON.parse(data))
            });
        });
    }
}