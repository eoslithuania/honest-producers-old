
function getLocation(url) {
    var l = document.createElement("a");
    l.href = url;
    return l.hostname.replace(/www[.]/gi, '')
        + l.pathname.replace(/\/$/gi, '') + "</a>";
};

function singleLinkFormatter(url) {
    if (url == null) {
        return;
    }
    return "<a class='link' href='" + url + "'>"
        + getLocation(url) + "</a>";
}

function multilinkFormatter(urls) {
    var aa = urls.map(singleLinkFormatter);
    return aa.reduce((acc, a) => acc + a, "");
}

fetch("https://raw.githubusercontent.com/Invertisment/eos-data/master/data.json")
    .then(res => res.json())
    .then((out) => {
        $(function () {
            $('#table').bootstrapTable({
                data: out['block-producers'],
                search: true,
                pagination: true,
                buttonsClass: 'primary',
                minimumCountColumns: 2,
                pageList:[10, 50, 100, "All"],
                columns: [
                    [
                        {
                            field: 'bp-header.owner',
                            title: 'BP name',
                            sortable: true,
                            rowspan: 2,
                        },{
                            field: 'bp-header.url',
                            title: 'Link',
                            sortable: true,
                            rowspan: 2,
                            formatter: singleLinkFormatter,
                        }, {
                            title: 'Webpage content summary',
                            colspan: 3,
                        },{
                            title: 'Analyzed urls',
                            colspan: 4,
                        },],
                    [
                        {
                            title: 'Image count',
                            field: 'summary.img-count',
                            sortable: true,
                            align: 'right',
                        }, {
                            title: 'Paragraph count',
                            field: 'summary.p-count',
                            sortable: true,
                            align: 'right',
                        }, {
                            title: 'Link count',
                            field: 'summary.a-count',
                            sortable: true,
                            align: 'right',
                        }
                        , {
                            title: 'Relative link count',
                            field: 'analyzed-urls.relative-links-count',
                            sortable: true,
                            align: 'right',
                        },
                        //{
                        //    title: 'Social links count',
                        //    field: 'analyzed-urls.social-links-count',
                        //    sortable: true,
                        //    align: 'right',
                        //}, {
                        //    title: 'Popularity boost links count',
                        //    field: 'analyzed-urls.popularity-boosters-count',
                        //    sortable: true,
                        //    align: 'right',
                        //}


                        {
                            title: 'Social links',
                            field: 'analyzed-urls.social-links',
                            sortable: true,
                            align: 'right',
                            formatter: multilinkFormatter,
                        }, {
                            title: 'Popularity boost links',
                            field: 'analyzed-urls.popularity-boosters',
                            sortable: true,
                            align: 'right',
                            formatter: multilinkFormatter,
                        }

                    ]]
            });
        });
    })
    .catch(err => { throw err });
