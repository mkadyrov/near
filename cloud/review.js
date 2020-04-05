Parse.Cloud.beforeSave('Review', async (req) => {

  const obj = req.object
  const attrs = obj.attributes
  const user = req.user

  if (!user && !req.master) throw 'Not Authorized'

  if (!obj.existed()) {
    const acl = new Parse.ACL()
    acl.setPublicReadAccess(true)
    acl.setRoleWriteAccess('Admin', true)
    acl.setWriteAccess(user, true)
    obj.setACL(acl)
    obj.set('user', user)
    obj.set('isInappropriate', false)
  }

  const query = new Parse.Query('Review')
  query.equalTo('user', user)
  query.equalTo('place', attrs.place)

  const exists = await query.first()

  if (exists) {
    throw new Parse.Error(5000, 'You already write a review for this place')
  } else if (obj.get('rating') < 1) {
    throw new Parse.Error(5001, 'You cannot give less than one star')
  } else if (obj.get('rating') > 5) {
    throw new Parse.Error(5002, 'You cannot give more than five stars')
  }

})

Parse.Cloud.afterSave('Review', async (req) => {

  const obj = req.object
  const attrs = obj.attributes
  const original = req.original

  if (obj.existed()) {

    try {

      const origAttrs = original.attributes

      if (attrs.status !== origAttrs.status) {

        const place = attrs.place

        await place.fetch()

        if (attrs.status === 'Published') {

          place.increment('ratingCount')
          place.increment('ratingTotal', attrs.rating)

        } else if (origAttrs.status === 'Published' &&
          (attrs.status === 'Pending' || attrs.status === 'Banned')) {

          place.increment('ratingCount', -1)
          place.increment('ratingTotal', -attrs.rating)

        }

        if (place.dirty()) {

          const ratingTotal = place.get('ratingTotal')
          const ratingCount = place.get('ratingCount')

          if (ratingTotal && ratingCount) {
            const ratingAvg = Math.round(ratingTotal / ratingCount)
            place.set('ratingAvg', ratingAvg)
          } else {
            place.set('ratingAvg', 0)
          }

          place.save(null, { useMasterKey: true })
        }

      }

    } catch (err) {
      console.warn(err.message)
    }
  }
})

Parse.Cloud.afterDelete('Review', async (req) => {

  const obj = req.object
  const attrs = obj.attributes

  if (attrs.status === 'Published') {
    const place = attrs.place

    await place.fetch()
  
    place.increment('ratingCount', -1)
    place.increment('ratingTotal', -attrs.rating)
  
    const ratingAvg = Math.round(place.get('ratingTotal') / place.get('ratingCount'))
    place.set('ratingAvg', ratingAvg)
  
    place.save(null, { useMasterKey: true })
  }

})