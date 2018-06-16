fetch("https://raw.githubusercontent.com/Invertisment/eos-data/master/data.json")
    .then(res => res.json())
    .then((out) => {
        $(function () {
            $('#table').bootstrapTable({
                data: out['block-producers'],
                search: true,
                pagination: true,
                buttonsClass: 'primary',
                showFooter: true,
                minimumCountColumns: 2,
                columns: [[{
                    field: 'bp-header.owner',
                    title: 'BP name',
                    sortable: true,
                    rowspan: 2,
                },{
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
                              }, {
                                  title: 'Social links',
                                  field: 'analyzed-urls.social-links',
                                  sortable: true,
                                  align: 'right',
                              }, {
                                  title: 'Popularity boost links',
                                  field: 'analyzed-urls.popularity-boosters',
                                  sortable: true,
                                  align: 'right',
                              }


                          ]]
            });
        });
    })
    .catch(err => { throw err });
